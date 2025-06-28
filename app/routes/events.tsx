import React, { useState } from 'react';
import { Alert, Modal, Pressable, Text, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Button, TextInput } from 'react-native-paper';
import { styles } from '../constants/styles';
import { send } from '../utils/utils';

// https://github.com/FaridSafi/react-native-google-places-autocomplete
function GooglePlacesInput(props: any) {
    return (
        <GooglePlacesAutocomplete
            placeholder="Search"
            onPress={(data, details = null) => {
                console.log(data, details);
            }}
            query={{
                // sounds inefficient, but annoyingly you can't use process.env outside of react components (returns undefined)
                key: props.apiKey,
                language: 'en',
                location: '40.7128,-74.0060',
                radius: 5000,
            }}
            fetchDetails={true}
            predefinedPlaces={[]} // ✅ Add this line
        />
    );
};

function EventModal() {
    const server = process.env.EXPO_PUBLIC_SERVER_URL;
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY;
    console.log(apiKey);
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
            <Text style={styles.header2}>Event location:</Text>
            <GooglePlacesInput apiKey={apiKey} />
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