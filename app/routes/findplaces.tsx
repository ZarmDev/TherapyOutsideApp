import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import MapView, { Circle, Marker, Region } from 'react-native-maps';
import { styles } from '../constants/styles';

import * as Location from 'expo-location';

const testing = true;
const apiKey = process.env.GOOGLE_MAP_KEY;
// Example fake location object for NYC (Central Park)
const fakeNYCLocation = {
    latitude: 40.785091,
    longitude: -73.968285,
    latitudeDelta: 1,
    longitudeDelta: 1,
}

// HELP OF AI HERE!
const fetchNearbyParks = async (latitude: number, longitude: number) => {
    const radius = 1500; // in meters
    const type = 'park';

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();
    const results = data.results;
    return results; // array of nearby parks
};

// Template taken from https://docs.expo.dev/versions/latest/sdk/location/
export default function FindPlaces() {
    // const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [region, setRegion] = useState<Region>(fakeNYCLocation);
    const [accuracy, setAccuracy] = useState<number | null>(500);
    const [places, setPlaces] = useState<any[]>([]);

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
                    latitudeDelta: 1,
                    longitudeDelta: 1,
                });
                setAccuracy(location.coords.accuracy)
            }
        }
        if (testing) {
            setRegion(fakeNYCLocation);
        } else {
            getCurrentLocation();
        }
        fetchNearbyParks(region.latitude, region.longitude);
    }, []);

    // When region changes
    useEffect(() => {
        async function fetchData() {
            const results = await fetchNearbyParks(region.latitude, region.longitude);
            setPlaces(results)
            // for (let i = 0; i < results.length; i++) {
            //     const location = results[i]["geometry"]["location"];
            //     const lat = results[i]["geometry"]["location"]["lat"];
            //     const lng = results[i]["geometry"]["location"]["lng"];
            //     console.log(results[i]["geometry"]["location"]["lat"]);
            //     break;
            // }
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
            {location == null ? <></> : <MapView region={region} style={styles.map}>
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
                {places.map((place, idx) => (
                    <React.Fragment key={place.place_id || idx}>
                        <Circle
                            center={{
                                latitude: place.geometry.location.lat,
                                longitude: place.geometry.location.lng,
                            }}
                            radius={40}
                            strokeColor="rgba(0,200,0,0.8)"
                            fillColor="rgba(0,200,0,0.3)"
                        />
                        <Marker
                            coordinate={{
                                latitude: place.geometry.location.lat,
                                longitude: place.geometry.location.lng,
                            }}
                            opacity={0} // invisible marker, but still clickable
                            onPress={() => {
                                // Show your popup or handle click here
                                console.log('Clicked place:', place.name);
                            }}
                        />
                    </React.Fragment>
                ))}
            </MapView>}
            {/* <Text>{text}</Text> */}
        </View>
    );
}