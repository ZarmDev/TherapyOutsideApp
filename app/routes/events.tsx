import { apiKey } from '@/constants/environmentvars';
import { fakeNYCLocation, testing, zoom } from '@/constants/mapdata';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, Text, View } from 'react-native';
import { Region } from 'react-native-maps';
import { Button, TextInput } from 'react-native-paper';
import { styles } from '../../constants/styles';
import { send } from '../utils/utils';

// https://github.com/FaridSafi/react-native-google-places-autocomplete
// function GooglePlacesInput(props: any) {
//     <GooglePlacesAutocomplete
//         placeholder="Search"
//         fetchDetails={true}
//         onPress={(data, details = null) => {
//             console.log(data, details);
//         }}
//         query={{
//             key: props.apiKey,
//             language: 'en',
//         }}
//         predefinedPlaces={[]}
//         textInputProps={{}}
//         minLength={2}
//         keyboardShouldPersistTaps='handled'
//     />

//     return (
//         <GooglePlacesAutocomplete
//             placeholder="Search"
//             onPress={(data, details = null) => {
//                 console.log(data, details);
//             }}
//             query={{
//                 key: apiKey,
//                 language: 'en',
//                 location: '40.7128,-74.0060',
//                 radius: 5000,
//             }}
//             fetchDetails={true}
//             predefinedPlaces={[]} // ✅ Add this line
//             textInputProps={{
//                 onFocus: () => { }, // ✅ Prevents the error
//             }}
//             styles={{
//                 container: {}, // ✅ Prevents the error
//                 textInputContainer: {},
//                 textInput: {},
//                 listView: {},
//             }}
//         />
//     );
// };

//https://developers.google.com/maps/documentation/places/web-service/place-autocomplete
const fetchNearbyPlaces = async (latitude: number, longitude: number, textInput : string) => {
    const url = `https://places.googleapis.com/v1/places:autocomplete`;

    const body = {
        input: textInput,
        locationBias: {
            circle: {
                center: {
                    latitude,
                    longitude,
                },
                radius: 5000.0, // meters
            },
        },
        includedPrimaryTypes: ["park"], // optional: bias toward parks
    };

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // don't show error even if apiKey is null
            "X-Goog-Api-Key": apiKey!,
            "X-Goog-FieldMask": "*", // or specify fields like 'places.displayName,places.location'
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        console.error("Failed to fetch places:", await response.text());
        return [];
    }

    const data = await response.json();
    return data["suggestions"] || []; // array of place predictions
};

function GooglePlacesInput() {
    const [text, setText] = useState("");
    const [region, setRegion] = useState<Region>(fakeNYCLocation);
    const [places, setPlaces] = useState<string[]>([]);

    useEffect(() => {
        async function getCurrentLocation() {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                // setErrorMsg('Permission to access location was denied');
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
            }
        }
        if (testing) {
            setRegion(fakeNYCLocation);
        } else {
            getCurrentLocation();
        }
    }, []);

    useEffect(() => {
        console.log(text);
        if (text == '') {
            return;
        }
        async function getNearbyPlaces() {
            const results = await fetchNearbyPlaces(region.latitude, region.longitude, text);
            var arrOfPlaces = [];
            for (var i = 0; i < results.length; i++) {
                const placePrediction = results[i]["placePrediction"];
                arrOfPlaces.push(placePrediction["text"]["text"]);
                setPlaces(arrOfPlaces)
            }

        }
        getNearbyPlaces();
    }, [text])

    return (
        <View>
            <TextInput
                label="Event"
                value={text}
                onChangeText={text => setText(text)}
            />
            {places.map((place, idx) => (<Button style={{margin: 5}} mode="contained-tonal" onPress={() => console.log('Pressed')}>
    {place}
  </Button>))}
        </View>
    )
}

function EventModal() {
    const [eventText, setEventText] = useState("");

    async function createEvent() {
        const formData = new URLSearchParams();
        formData.append('eventName', eventText);
        send("createEvent", formData)
    }

    return (
        <View>
            <Text style={styles.header}>Create an event</Text>
            <TextInput
                style={styles.textInput}
                label="Event name"
                value={eventText}
                onChangeText={text => setEventText(text)}
            />
            <Text style={styles.header2}>Choose the event location:</Text>
            <GooglePlacesInput />
            <Button mode="contained" onPress={createEvent} style={styles.modalButton}>
                Create event
            </Button>
        </View>
    );
}

const order = [<EventModal />];

function Events() {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState(0);

    function event() {
        setModalVisible(true);
        setModalType(0);
    }

    return (
        <View style={styles.centeredView}>
            <Text style={styles.header}>Events</Text>
            <Button mode="contained" onPress={event}>
                Create an event
            </Button>
            <Text style={styles.header2}>Or, find groups</Text>
            <Button mode="contained" onPress={() => console.log('Pressed')}>
                Create a group
            </Button>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.modalView2}>
                    {order[modalType]}
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={styles.textStyle}>Hide</Text>
                    </Pressable>
                </View>
            </Modal>
        </View>
    );
};

export default Events;