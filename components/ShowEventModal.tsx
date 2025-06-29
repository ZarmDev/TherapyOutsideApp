import { styles } from '@/constants/styles';
import React from 'react';
import { Text, View } from 'react-native';

export default function ShowEventModal(props: any) {
    return (
        <View>
            <Text style={styles.header}>Events for {props.selectedGroupName}</Text>
            {props.selectedGroup["currentevents"].map((place : any, idx : number) => (<Text key={idx}>
                {place["title"]}
            </Text>))}
        </View>
    );
}