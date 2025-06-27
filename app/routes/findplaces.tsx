import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import MapView from 'react-native-maps';
import { styles } from '../constants/styles';

import * as Location from 'expo-location';

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

        getCurrentLocation();
    }, []);

    let text = 'Waiting...';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    return (
        <View style={styles.container}>
            <MapView initialRegion={{
                latitude: 40.71770894149686,
                longitude: -73.9929064296264,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }} style={styles.map} />
            <Text>{text}</Text>
        </View>
    );
}