import { styles } from '@/constants/styles';
import { readInDocumentDirectory } from '@/utils/utils';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

function DailyLog() {
    const [placesVisited, setPlacesVisited] = useState<string[]>([]);

    async function getPlacesVisited() {
        const fileContents = await readInDocumentDirectory("visited");
        if (fileContents) {
            setPlacesVisited(fileContents.split('\n'));
        }
    }

    useEffect(() => {
        console.log("Z");
        getPlacesVisited();
    }, [])

    return (
        <View>
            <Text style={styles.header}>Statistics</Text>
            <Text style={styles.header2}>You've visited {placesVisited.length} places</Text>
            <Text style={styles.header2}>You've joined {0} events</Text>
        </View>
    );
};

export default DailyLog;