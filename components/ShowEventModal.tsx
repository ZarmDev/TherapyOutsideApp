import { styles } from '@/constants/styles';
import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function ShowEventModal(props: any) {
    return (
        <View>
            <Text style={styles.header}>Current events for {props.selectedGroupName}</Text>
            {props.selectedGroup["currentevents"].map((place : any, idx : number) => (<View key={idx} style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginVertical: 8,
                }}>
                    <Text style={{ marginRight: 12 }}>
                        {place["title"]} ({0} participants)
                    </Text>
                    <Button
                        style={styles.button}
                        mode="contained-tonal"
                        onPress={() => {  }}
                    >
                        See on map
                    </Button>
                    <Button
                        mode="contained-tonal"
                        onPress={() => {  }}
                    >
                        Join event
                    </Button>
                </View>))}
        </View>
    );
}