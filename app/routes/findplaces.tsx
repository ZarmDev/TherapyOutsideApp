import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import MapView, { Circle, Region } from 'react-native-maps';
import { styles } from '../constants/styles';

import * as Location from 'expo-location';

const testing = true;
// Example fake location object for NYC (Central Park)
const fakeNYCLocation = {
    latitude: 40.785091,
    longitude: -73.968285,
    latitudeDelta: 1,
    longitudeDelta: 1,
}

// Template taken from https://docs.expo.dev/versions/latest/sdk/location/
export default function FindPlaces() {
    // const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [region, setRegion] = useState<Region>(fakeNYCLocation);
    const [accuracy, setAccuracy] = useState<number | null>(500);

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
    }, []);

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

            </MapView>}
            {/* <Text>{text}</Text> */}
        </View>
    );
}