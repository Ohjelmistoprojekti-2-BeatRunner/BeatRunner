import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    title: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
    },
    indexContainer: {
        flex: 1,
        backgroundColor: 'black',
    },
    container: {
        flex: 1,
        backgroundColor: 'black',
        padding: 20,
        paddingTop: 40,
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
    button: {
        marginTop: 0,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    buttonCompleted: {
        marginTop: 0,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderWidth: 2,
        borderColor: 'green',
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    smallButton: {
        marginTop: 20,
        backgroundColor: '#555',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        width: '35%',
    },
    buttonText: {
        color: 'white',
        fontSize: 24,
    },
    orText: {
        color: 'white',
        fontSize: 24,
        marginVertical: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 8,
        padding: 10,
        color: 'white',
        marginTop: 5,
        width: '70%',
    },
    sectionTitle: {
        color: 'white',
        fontSize: 20,
        marginTop: 20,
        marginBottom: 10,
    },
    logoutButton: {
        marginTop: 20,
        backgroundColor: '#8b0000', // red color for Logout
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        alignSelf: 'flex-end', // positioned on the right
        width: '30%',
    },
    contentContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#333',
        borderRadius: 10,
    },
    contentText: {
        color: 'white',
        fontSize: 18,
        marginVertical: 5,
    },
    link: {
        marginTop: 20,
        color: 'lightblue',
        textDecorationLine: 'underline',
    },
    //"table"-like styles for flatlists:
    listRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgb(97, 40, 112)',
    },
    listCell: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        textAlign: 'left',
    },
    listCellLinkText: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        textAlign: 'left',
    },
    listHeader: {
        fontWeight: 'bold',
        fontSize: 17,
        color: 'rgb(97, 40, 112)',
      },

});