import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        fontSize: 30
    },
    header2: {
        fontSize: 20,
        textAlign: "center"
    },
    paragraph: {
        fontSize: 20
    },
    navigation: {
        width: '100%'
    },
    map: {
        width: '100%',
        height: '100%',
    },
})