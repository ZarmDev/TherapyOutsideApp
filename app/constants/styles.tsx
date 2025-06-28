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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 0,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 100,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 20
    },
    textContainer: {
        padding: 1,
        borderRadius: 4
    },
    textOnMapStyle: {
        color: 'black',
        fontSize: 12
    },
    treeIcon: {
        flexDirection: 'column', 
        justifyContent: "center", 
        alignItems: "center", 
        width: 70,
        height: 70, 
        gap: 14,
        padding: 5
    }
})