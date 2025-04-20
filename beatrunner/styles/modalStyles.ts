
import { StyleSheet } from "react-native";

export const modalStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modal: {
        width: '95%',
        maxHeight: '90%',
        backgroundColor: '#1a1a1a',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 12,
        elevation: 12,
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 10,
        padding: 10,
    },
    closeText: {
        fontSize: 26,
        color: '#aaa',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    contentCard: {
        backgroundColor: '#2b2b2b',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
    },
    cardTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    cardText: {
        color: '#ccc',
        fontSize: 16,
        marginBottom: 4,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
        marginBottom: 8,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
    listText: {
        color: '#ddd',
        fontSize: 15,
    },
    loader: {
        marginTop: 40,
    },
});
