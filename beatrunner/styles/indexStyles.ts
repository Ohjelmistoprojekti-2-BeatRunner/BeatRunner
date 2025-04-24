import { StyleSheet } from "react-native";

export const indexStyles = StyleSheet.create({
    title: {
        color: 'white',
        fontSize: 29,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10
    },
    indexContainer: {
        flex: 1,
        backgroundColor: 'black',
    },
    container: {
        flex: 1,
        backgroundColor: 'black',
        padding: 3,
    },
    topContainer: {
        marginTop: 20,
        margin: 20
    },
    bottomContainer: {
        alignItems: 'center',
        paddingBottom: 50,
    },
    levelButton: {
        paddingVertical: 13,
        paddingHorizontal: 20,
        borderWidth: 2,
        borderColor: 'rgb(97, 40, 112)',
        borderRadius: 15,
        backgroundColor: 'rgb(24, 3, 29)',
        boxShadow: '5px 5px 6px rgb(89, 34, 104)',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    levelButtonCompleted: {
        paddingVertical: 13,
        paddingHorizontal: 20,
        borderWidth: 2,
        borderColor: 'rgb(97, 112, 40)',
        borderRadius: 15,
        backgroundColor: 'rgb(24, 3, 29)',
        boxShadow: '5px 5px 6px rgb(89, 104, 34)',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    difficultyText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlignVertical: 'center',
    },
    buttonText: {
        fontSize: 23,
    },
});