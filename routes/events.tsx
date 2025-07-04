import ChatModal from '@/components/ChatModal';
import EventModal from '@/components/EventModal';
import GroupModal from '@/components/GroupModal';
import ShowEventModal from '@/components/ShowEventModal';
import { styles } from '@/constants/styles';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, useColorScheme, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { send } from '../utils/utils';

const order = [EventModal, GroupModal, ShowEventModal, ChatModal];

function Groups(props: any) {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState(0);
    const [events, setEvents] = useState<any>({});
    const [selectedGroupData, setSelectedGroupData] = useState<string>();
    const [selectedGroupName, setSelectedGroupName] = useState<string>();
    const colorScheme = useColorScheme();

    function createEventModal(idx: number) {
        const groupName = Object.keys(events)[idx];
        setModalVisible(true);
        setModalType(0);
        setSelectedGroupData(events[groupName]);
        setSelectedGroupName(Object.keys(events)[idx]);
    }

    function createGroupModal() {
        setModalVisible(true);
        setModalType(1);
    }

    function chatModal(idx : number) {
        const groupName = Object.keys(events)[idx];
        setModalVisible(true);
        setModalType(3);
        setSelectedGroupData(events[groupName]);
        setSelectedGroupName(Object.keys(events)[idx]);
    }

    function seeOnMapCallback(eventIdx: number) {
        props.navigateToFindPlaces([events, eventIdx, selectedGroupName], 0);
    }

    function showEventModal(idx: number) {
        const groupName = Object.keys(events)[idx];
        // console.log(events[groupName])
        setModalVisible(true);
        setSelectedGroupData(events[groupName]);
        setSelectedGroupName(groupName);
        setModalType(2);
    }

    async function updateGroups() {
        const formData = new URLSearchParams();
        const res = await send("getGroups", formData);
        if (res) {
            const data = await res.text();
            setEvents(JSON.parse(data));
        }
    }

    useEffect(() => {
        updateGroups();

        // const interval = setInterval(async () => {
        //     const formData = new URLSearchParams();
        //     const res = await send("getGroups", formData);
        //     if (res) {
        //         const data = await res.text();
        //         console.log(Object.keys(JSON.parse(data)));
        //     }
        // }, 5000);

        // // Cleanup on unmount
        // return () => clearInterval(interval);
    }, []); // <-- empty array means this runs only once

    const ModalComponent = order[modalType];

    return (
        <View style={styles.centeredView}>
            <Text style={styles.header2}>To create an event or join events, first find a group</Text>
            <Button mode="contained" onPress={createGroupModal} style={styles.button}>
                Create a group
            </Button>
            <Button mode="contained" onPress={updateGroups} style={styles.button}>
                Refresh
            </Button>
            <Text style={styles.header}>List of groups:</Text>
            {Object.keys(events).length == 0 ? <Text>Unable to load groups, please refresh the page.</Text> : Object.keys(events).map((name, idx) => (
                <View key={idx} style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginVertical: 8,
                }}>
                    <Text style={{ marginRight: 12 }}>
                        {name}
                    </Text>
                    <Button
                        style={styles.button}
                        mode="contained-tonal"
                        onPress={() => { createEventModal(idx) }}
                    >
                        Create event
                    </Button>
                    <Button
                        mode="contained-tonal"
                        onPress={() => { showEventModal(idx) }}
                    >
                        See events
                    </Button>
                    <Button
                        key={idx}
                        style={styles.button}
                        mode="contained-tonal"
                        onPress={() => { chatModal(idx) }}
                    >
                        Chat
                    </Button>
                </View>
            ))}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={[
                    styles.modalView2,
                    colorScheme === 'dark' ? { "backgroundColor": "#342E35" } : { "backgroundColor": "white" }
                ]}>
                    {/* Render the modal based on which is chosen at moment (I used AI to help me figure out this neat trick) */}
                    <ModalComponent username={props.username} password={props.password} showMapCallback={seeOnMapCallback} setModalVisibleCallback={(bool: boolean) => { setModalVisible(bool) }} selectedGroupData={selectedGroupData} selectedGroupName={selectedGroupName} refresh={updateGroups} />
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={styles.bigPaddingButton}>Hide</Text>
                    </Pressable>
                </View>
            </Modal>
        </View>
    );
};

export default Groups;