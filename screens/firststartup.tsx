import { send, writeToDocumentDirectory } from '@/utils/utils';
import * as React from 'react';
import { useState } from 'react';
import { View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { styles } from '../constants/styles';

function FirstPage() {
    return (
        <Text style={styles.header}>Welcome to TherapyOutside!</Text>
    )
};

function SecondPage() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [message, setMessage] = useState("");

    async function createAccount() {
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);
        const res = await send("createAccount", formData);
        if (res?.status != 201) {
            setMessage("Unable to create account! " + res?.statusText)
        } else {
            setMessage("Success! You can proceed with the setup")
        }
        await writeToDocumentDirectory("userdata", `${username}\n${password}`);
    }

    return (
        <View style={styles.centeredView}>
            <Text style={styles.header}>Create an account</Text>
            <Text style={{textAlign: "center"}}>(parts of this app will not work if you do not)</Text>
            <TextInput
                style={styles.textInput}
                label="Username"
                value={username}
                onChangeText={text => setUsername(text)}
            />
            <TextInput
                style={styles.textInput}
                label="Password"
                value={password}
                onChangeText={text => setPassword(text)}
            />
            <Button mode="contained-tonal" onPress={createAccount}>
                Create account
            </Button>
            <Text style={{margin: 20}}>{message}</Text>
        </View>
    )
};

const order = [<FirstPage />, <SecondPage />];

function FirstStartup(props: any) {
    const [page, setPage] = React.useState(0);

    function writeFirstStartup() {
        writeToDocumentDirectory('firststartup.txt', 'o');
        props.finishedCallback()
    }

    return (
        <View style={styles.centeredFlex}>
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