import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { styles } from '../constants/styles';

import * as Location from 'expo-location';

const testing = true;
// Example fake location object for NYC (Central Park)
const fakeNYCLocation = {
    coords: {
        latitude: 40.785091,
        longitude: -73.968285,
        altitude: 30,
        accuracy: 5,
        altitudeAccuracy: 1,
        heading: 0,
        speed: 0,
    },
    timestamp: Date.now(),
};

// Template taken from https://docs.expo.dev/versions/latest/sdk/location/
export default function FindPlaces() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        async function getCurrentLocation() {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        }
        if (testing) {
            setLocation(fakeNYCLocation as Location.LocationObject);
        } else {
            getCurrentLocation();
        }
    }, []);

    let text = 'Waiting...';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    return (
        <View style={styles.container}>
            {location == null ? <></> : <MapView region={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922, // for zoom
                longitudeDelta: 0.0421, // for zoom
            }} style={styles.map}>
                <Marker coordinate={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                }}>
                    <View style={{
                        height: 20,
                        width: 20,
                        borderRadius: 10,
                        backgroundColor: 'blue',
                        borderColor: 'white',
                        borderWidth: 2,
                    }} />
                </Marker>

            </MapView>}
            {/* <Text>{text}</Text> */}
        </View>
    );
}