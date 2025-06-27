import { View, Text, StyleSheet } from 'react-native';
import * as React from 'react';
import { Button } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import { styles } from '../constants/styles';

function FirstPage() {
    return (
        <Text style={styles.header}>Welcome</Text>
    )
};
const order = [<FirstPage />];

function FirstStartup(props) {
    const [page, setPage] = React.useState(0);

    const writeToDocumentDirectory = async (fileName, content) => {
        const fileUri = FileSystem.documentDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, content);
        console.log('File written successfully');
    };

    function writeFirstStartup() {
        writeToDocumentDirectory('firststartup.txt', 'o');
        props.finishedCallback()
    }

    return (
        <View style={styles.container}>
            {order[page]}
            {page == order.length - 1 ? <Button style={styles.nextButton} mode="contained" onPress={writeFirstStartup}>
                Let's go!
            </Button> : <Button style={styles.nextButton} mode="contained" onPress={() => setPage(page + 1)}>
                Next
            </Button>}
        </View>
    );
};

export default FirstStartup;