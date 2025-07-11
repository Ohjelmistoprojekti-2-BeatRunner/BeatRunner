import { StyleSheet } from "react-native";

export const aboutStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        padding: 20,
        margin: 4
    },
    topContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 50,
    },
    contentContainer: {
        marginTop: 10,
        marginBottom: 23,
        padding: 10,
        backgroundColor: 'rgb(29, 3, 36)',
        borderRadius: 20,
        boxShadow: 'inset 0 1px 20px 3px rgb(0, 0, 0)',
    },
    contentText: {
        color: 'white',
        fontSize: 16,
        margin: 7,
    },
    link: {
        color: 'lightblue',
        textDecorationLine: 'underline',
    },
    sectionTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    },
})