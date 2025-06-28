import * as FileSystem from 'expo-file-system';
import * as React from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { styles } from '../constants/styles';

function FirstPage() {
    return (
        <Text style={styles.header}>Welcome to TherapyOutside!</Text>
    )
};

function SecondPage() {
    return (
        <Text>This app has features like...</Text>
    )
};

const order = [<FirstPage />, <SecondPage/>];

function FirstStartup(props : any) {
    const [page, setPage] = React.useState(0);

    const writeToDocumentDirectory = async (fileName : string, content : string) => {
        const fileUri = FileSystem.documentDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, content);
        console.log('File written successfully');
    };

    function writeFirstStartup() {
        writeToDocumentDirectory('firststartup.txt', 'o');
        props.finishedCallback()
    }

    return (
        <View style={styles.centeredView}>
            {order[page]}
            {page == order.length - 1 ? <Button style={styles.bottomRightButton} mode="contained" onPress={writeFirstStartup}>
                Let's go!
            </Button> : <Button style={styles.bottomRightButton} mode="contained" onPress={() => setPage(page + 1)}>
                Next
            </Button>}
        </View>
    );
};

export default FirstStartup;