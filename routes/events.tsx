import { apiKey } from '@/constants/environmentvars';
import { fakeNYCLocation, testing, zoom } from '@/constants/mapdata';
import { styles } from '@/constants/styles';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, Text, View } from 'react-native';
import { Region } from 'react-native-maps';
import { Button, TextInput } from 'react-native-paper';
import { send } from '../utils/utils';

// Usage of AI
const fetchPlaceDetails = async (placeId: string) => {
    const url = `https://places.googleapis.com/v1/places/${placeId}?fields=location&key=${apiKey}`;
    console.log(url);
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        console.error("Failed to fetch place details:", await response.text());
        return null;
    }

    const data = await response.json();
    console.log(data.location);
    return data.location; // { latitude: number, longitude: number }
};

// const fetchPlaceDetails = async (latitude: number, longitude: number, textInput: string) => {
//     const url = `https://places.googleapis.com/v1/places/${placeId}?fields=id,displayName&key=API_KEY`;

//     const body = {
//         input: textInput,
//         locationBias: {
//             circle: {
//                 center: {
//                     latitude,
//                     longitude,
//                 },
//                 radius: 5000.0, // meters
//             },
//         },
//         // includedPrimaryTypes: ["park"], // optional: bias toward parks
//     };

//     const response = await fetch(url, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             // don't show error even if apiKey is null
//             "X-Goog-Api-Key": apiKey!,
//             "X-Goog-FieldMask": "*", // or specify fields like 'places.displayName,places.location'
//         },
//         body: JSON.stringify(body),
//     });

//     if (!response.ok) {
//         console.error("Failed to fetch places:", await response.text());
//         return [];
//     }

//     const data = await response.json();
//     return data;
// };


// Usage of AI and https://developers.google.com/maps/documentation/places/web-service/place-autocomplete
const fetchNearbyPlaces = async (latitude: number, longitude: number, textInput: string) => {
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
        // includedPrimaryTypes: ["park"], // optional: bias toward parks
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
    return data;
};

function GooglePlacesInput() {
    const [text, setText] = useState("");
    const [region, setRegion] = useState<Region>(fakeNYCLocation);
    const [places, setPlaces] = useState<string[]>([]);
    const [placeIds, setPlaceIds] = useState<string[]>([]);

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
        if (text == "") {
            return;
        }
        async function getNearbyPlaces() {
            const data = await fetchNearbyPlaces(region.latitude, region.longitude, text);
            const suggestions = data["suggestions"];

            var arrOfPlaces = [];
            var arrOfIds = [];
            for (let i = 0; i < suggestions.length; i++) {
                const placePrediction = suggestions[i]["placePrediction"];
                arrOfPlaces.push(placePrediction["text"]["text"]);
                arrOfIds.push(placePrediction["placeId"])
                setPlaces(arrOfPlaces)
                setPlaceIds(arrOfIds);
            }
        }
        getNearbyPlaces();
    }, [text])

    return (
        <View style={{height: 400}}>
            <TextInput
                label="Event"
                value={text}
                onChangeText={text => setText(text)}
            />
            {places.map((place, idx) => (<Button key={idx} style={{ margin: 5 }} mode="contained-tonal" onPress={async () => {
                const data = await fetchPlaceDetails(placeIds[idx]);
                setText(place);
            }}>
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

function GroupModal() {
    const [eventText, setEventText] = useState("");

    async function createGroup() {
        const formData = new URLSearchParams();
        formData.append('groupName', eventText);
        send("createGroup", formData)
    }

    return (
        <View>
            <Text style={styles.header}>Create a group</Text>
            <TextInput
                style={styles.textInput}
                label="Group name"
                value={eventText}
                onChangeText={text => setEventText(text)}
            />
            <Button mode="contained" onPress={createGroup} style={styles.modalButton}>
                Create group
            </Button>
        </View>
    );
}

const order = [<EventModal />, <GroupModal />];

function Events() {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState(0);

    function event() {
        setModalVisible(true);
        setModalType(0);
    }

    function group() {
        setModalVisible(true);
        setModalType(1);
    }

    return (
        <View style={styles.centeredView}>
            {/* <Text style={styles.header}>Events</Text>
            <Button mode="contained" onPress={event}>
                Create an event
            </Button> */}
            <Text style={styles.header2}>To create an event or join events, first find a group</Text>
            <Button mode="contained" onPress={group}>
                Create a group
            </Button>
            {/* load groups... */}
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