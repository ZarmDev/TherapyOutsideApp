import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, Modal, Pressable, Text, View } from 'react-native';
import MapView, { Circle, Marker, Region } from 'react-native-maps';
import { styles } from '../constants/styles';

import * as Location from 'expo-location';

const testing = false;
const zoom = 0.05;

// Example fake location object for NYC (Central Park)
const fakeNYCLocation = {
    latitude: 40.785091,
    longitude: -73.968285,
    latitudeDelta: zoom,
    longitudeDelta: zoom,
}

// HELP OF AI HERE!
const fetchNearbyParks = async (latitude: number, longitude: number) => {
    const radius = 500; // in meters
    const type = 'park';
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY;

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();
    const results = data.results;
    return results; // array of nearby parks
};

const fetchParkPhoto = async (latitude: number, longitude: number, photoReference : any) => {
    const radius = 500; // in meters
    const type = 'park';
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY;

    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;

    return url;
};

// Template taken from https://docs.expo.dev/versions/latest/sdk/location/
export default function FindPlaces() {
    // const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [region, setRegion] = useState<Region>(fakeNYCLocation);
    const [accuracy, setAccuracy] = useState<number | null>(500);
    const [places, setPlaces] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [itemIdx, setItemIdx] = useState<number>(0);
    const [showPlaces, setShowPlaces] = useState(true);
    const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
    const lastZoom = useRef(region.latitudeDelta);

    useEffect(() => {
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
        if (testing) {
            setRegion(fakeNYCLocation);
        } else {
            getCurrentLocation();
        }
    }, []);

    function handleRegionChange(newRegion: Region) {
        const shouldShow = newRegion.latitudeDelta < 0.05;
        // Just check if boolean is different rather than triggering rerender/update state
        if (shouldShow !== showPlaces) {
            setShowPlaces(shouldShow);
        }
        lastZoom.current = newRegion.latitudeDelta;
    }

    // When region changes
    useEffect(() => {
        async function fetchData() {
            const results = await fetchNearbyParks(region.latitude, region.longitude);
            // const photoResults = await fetchNearbyParkPhotos(region.latitude, region.longitude)
            setPlaces(results)
        }
        fetchData();

    }, [region])

    let text = 'Waiting...';
    if (errorMsg) {
        text = errorMsg;
    } else if (region) {
        text = JSON.stringify(region);
    }

    return (
        <View style={styles.container}>
            {location == null ? <></> : <MapView
                region={region}
                style={styles.map}
                onRegionChange={handleRegionChange}>
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
                        key={place.id}
                        coordinate={{
                            latitude: place.geometry.location.lat,
                            longitude: place.geometry.location.lng,
                        }}
                        anchor={{ x: 0.5, y: 0.5 }} // Center the marker
                        // opacity={0} // invisible marker, but still clickable
                        onPress={async () => {
                            // Show your popup or handle click here
                            console.log('Clicked place:', place.name);
                            const photoReference = place.photos?.[0]?.photo_reference;
                            const loadPhoto = photoReference == undefined ? null : await fetchParkPhoto(region.latitude, region.longitude, photoReference);
                            console.log(loadPhoto)
                            setModalVisible(true);
                            setItemIdx(idx);
                            setCurrentPhoto(loadPhoto)
                        }}
                        image={require('../../assets/images/tree-pine.png')}
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
                        <Text style={styles.textOnMapStyle}>{place.name}</Text>
                    </Marker>
                )) : <></>}
            </MapView>}
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
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{places[itemIdx]?.["name"]}</Text>
                        <Image
                            source={{ uri: currentPhoto == null ? "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500" : currentPhoto }}
                            style={{ width: 400, height: 200, borderRadius: 8, marginBottom: 8 }}
                            resizeMode="cover"
                        />
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.textStyle}>Hide</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}