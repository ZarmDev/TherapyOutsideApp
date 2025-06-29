import { apiKey } from '@/constants/environmentvars';
import { styles } from '@/constants/styles';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, Modal, Pressable, useColorScheme, View } from 'react-native';
import MapView, { Circle, Marker, Region } from 'react-native-maps';

import FloatingMenu from '@/components/floatingactionmenu';
import { darkMapStyle, fakeNYCLocation, testing, zoom } from '@/constants/mapdata';
import { appendIfDoesntExistInDocumentDirectory, readInDocumentDirectory } from '@/utils/utils';
import * as Location from 'expo-location';
import { Button, Text } from 'react-native-paper';


// HELP OF AI HERE!
const fetchNearbyParks = async (latitude: number, longitude: number) => {
    const radius = 500; // in meters
    const type = 'park';

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();
    const results = data.results;
    return results; // array of nearby parks
};

const fetchParkPhoto = async (latitude: number, longitude: number, photoReference: any) => {
    const radius = 500; // in meters
    const type = 'park';
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY;

    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;

    return url;
};

// Template taken from https://docs.expo.dev/versions/latest/sdk/location/
export default function FindPlaces(props: any) {
    // const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [region, setRegion] = useState<Region>(fakeNYCLocation);
    const [accuracy, setAccuracy] = useState<number | null>(500);
    const [places, setPlaces] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [itemIdx, setItemIdx] = useState<number>(0);
    const [showPlaces, setShowPlaces] = useState(false);
    const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
    // For fast id lookup
    const [visitedIds, setVisitedIds] = useState<Set<string>>(new Set());
    const lastZoom = useRef(region.latitudeDelta);
    const colorScheme = useColorScheme();

    async function getCurrentLocation() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        if (location) {
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: zoom,
                longitudeDelta: zoom,
            });
            setAccuracy(location.coords.accuracy)
        }
    }

    function handleRegionChange(newRegion: Region) {
        // We can render your normal locatio nnow
        if (props.passedLocation != undefined) {
            getCurrentLocation();
            return;
        }
        const shouldShow = newRegion.latitudeDelta < 0.05;
        // Just check if boolean is different rather than triggering rerender/update state
        if (shouldShow !== showPlaces) {
            setShowPlaces(shouldShow);
        }
        lastZoom.current = newRegion.latitudeDelta;
    }

    async function refreshVisitedPlaces() {
        const data = await readInDocumentDirectory("visited");
        if (data) {
            setVisitedIds(new Set(data.split('\n')));
        }
    }

    async function markAsVisited() {
        await appendIfDoesntExistInDocumentDirectory("visited", places[itemIdx]["place_id"]);
        refreshVisitedPlaces();
    }

    useEffect(() => {
        // If we are given a location to go to
        if (props.passedLocation != undefined) {
            const [events, eventIdx, selectedGroupName] = props.passedLocation;
            const location = events[selectedGroupName]["currentevents"][eventIdx]["location"];
            console.log(location);
            const locationToGo = {
                latitude: location["latitude"],
                longitude: location["longitude"],
                latitudeDelta: zoom / 4,
                longitudeDelta: zoom / 4,
            }
            setAccuracy(25)
            setRegion(locationToGo)
        } else if (testing) {
            setRegion(fakeNYCLocation);
        } else {
            getCurrentLocation();
        }

        refreshVisitedPlaces();
    }, []);

    async function fetchData() {
        const results = await fetchNearbyParks(region.latitude, region.longitude);
        // const photoResults = await fetchNearbyParkPhotos(region.latitude, region.longitude)
        setPlaces(results)
    }

    // When region changes
    useEffect(() => {
        if (props.passedLocation != undefined) {
            fetchData();
        }
    }, [region])

    let text = 'Waiting...';
    if (errorMsg) {
        text = errorMsg;
    } else if (region) {
        text = JSON.stringify(region);
    }

    return (
        <View style={styles.container}>
            <MapView
                region={region}
                style={styles.map}
                onRegionChange={handleRegionChange}
                // onPress={(e) => {
                //     const { latitude, longitude } = e.nativeEvent.coordinate;
                //     // console.log("Latitude:", latitude);
                //     // console.log("Longitude:", longitude);
                //     // You can now use these coordinates to create an event
                // }}
                // Help of AI
                customMapStyle={colorScheme === 'dark' ? darkMapStyle : []}
            >
                <Circle
                    center={{
                        latitude: region.latitude,
                        longitude: region.longitude,
                    }}
                    // @ts-ignore (will never be null)
                    radius={accuracy} // in meters
                    strokeColor="rgba(0,122,255,0.5)"
                    fillColor="rgba(0,122,255,0.3)"
                    strokeWidth={2}
                />
                {showPlaces ? places.map((place, idx) => (
                    <Marker
                        style={styles.treeIcon}
                        key={idx}
                        coordinate={{
                            latitude: place.geometry.location.lat,
                            longitude: place.geometry.location.lng,
                        }}
                        anchor={{ x: 0.5, y: 0.5 }} // Center the marker
                        // opacity={0} // invisible marker, but still clickable
                        onPress={async () => {
                            // Show your popup or handle click here
                            // console.log('Clicked place:', place.name);
                            const photoReference = place.photos?.[0]?.photo_reference;
                            const loadPhoto = photoReference == undefined ? null : await fetchParkPhoto(region.latitude, region.longitude, photoReference);
                            setModalVisible(true);
                            setItemIdx(idx);
                            setCurrentPhoto(loadPhoto)
                        }}
                        image={require('../assets/images/tree-pine.png')}
                    >
                        <Circle
                            center={{
                                latitude: place.geometry.location.lat,
                                longitude: place.geometry.location.lng,
                            }}
                            radius={40}
                            strokeColor="rgba(0,200,0,0.8)"
                            fillColor="rgba(0,200,0,0.3)"
                        />
                        <View style={styles.textContainer}></View>
                        <Text style={visitedIds.has(place.place_id) ? styles.visitedTextOnMapStyle : styles.textOnMapStyle}>{place.name}</Text>
                    </Marker>
                )) : <></>}
            </MapView>
            {/* <Text>{text}</Text> */}
            {/* Taken from https://reactnative.dev/docs/modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View style={[
                        styles.modalView,
                        colorScheme === 'dark' ? { "backgroundColor": "#342E35" } : { "backgroundColor": "white" }
                    ]}>
                        <Text style={styles.modalText}>{places[itemIdx]?.["name"]}</Text>
                        <Image
                            source={{ uri: currentPhoto == null ? "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500" : currentPhoto }}
                            style={{ width: 400, height: 200, borderRadius: 8, marginBottom: 8 }}
                            resizeMode="cover"
                        />
                        <Button style={styles.button} mode="contained-tonal" onPress={markAsVisited}>Marked as visited</Button>
                        <Pressable
                            style={[styles.bigPaddingButton, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.textStyle}>Hide</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <FloatingMenu></FloatingMenu>
            {/* <Button mode="contained-tonal" style={styles.topRight}>Host an event</Button> */}
        </View>
    );
}