import { styles } from '@/constants/styles';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { send } from '../utils/utils';

export default function GroupModal(props: any) {
    const [eventText, setEventText] = useState("");

    async function createGroup() {
        const formData = new URLSearchParams();
        formData.append('groupName', eventText);
        send("createGroup", formData);
        props.setModalVisibleCallback(false);
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