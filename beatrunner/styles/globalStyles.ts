import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export const globalStyles = StyleSheet.create({
    title: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
        margin: 20
    },
    indexContainer: {
        flex: 1,
        backgroundColor: 'black',
    },
    container: {
        flex: 1,
        backgroundColor: 'black',
        padding: 20,
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
        marginTop: 3,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        width: "76%"
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
        backgroundColor: 'rgba(226, 44, 250, 0.18)',
        borderColor: 'rgb(180, 100, 200)',
        padding: 10,
        borderRadius: 12,
        alignItems: 'center',
        width: 200,
        height: 50,
        borderWidth: 2
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
    },
    orText: {
        color: 'white',
        fontSize: 24,
        marginVertical: 10,
    },
    input: {
        borderWidth: 2,
        borderColor: 'rgb(180, 100, 200)',
        borderRadius: 8,
        padding: 10,
        color: 'white',
        marginTop: 5,
        width: '76%',
        backgroundColor: 'rgba(226, 44, 250, 0.18)'
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
        fontSize: 18
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
        color: 'rgb(180, 100, 200)',
        fontSize: 16,
        textAlign: 'left',
    },
    listHeader: {
        fontWeight: 'bold',
        fontSize: 17,
        color: 'rgb(150, 90, 180)',
        textShadowColor: 'white',
    },

    //stat-box-styles:
    statContentContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: 'rgba(226, 44, 250, 0.18)',
        boxShadow: 'inset 0 1px 20px 3px rgb(0, 0, 0)',
        borderRadius: 15,
    },
    statContentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statRowText: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'normal',
        marginRight: 30
    },
    statRowTitle: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
        marginLeft: 30
    },

    dropdownpicker: {
        backgroundColor: "rgb(24, 3, 29)", borderColor: 'rgb(97, 40, 112)', marginBottom: 20
    },
    selector: {
        marginTop: 10,
        backgroundColor: 'rgb(97, 40, 112)',
        borderRadius: 9,
        borderColor: "purple"
    },

    // level styles:
    playerContainer: {
        borderRadius: 100,
        height: 350,
        width: screenWidth + 30,
        alignItems: 'center',
        marginBottom: -60,
        backgroundColor: 'rgba(226, 44, 250, 0.18)',
        borderColor: "rgb(89, 34, 104)",
        borderWidth: 3,
        boxShadow: 'inset 0 5px 30px 6px rgb(89, 34, 104)',
        alignContent: 'center'
    },
    playerHeader: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        zIndex: 1,
        marginTop: 20
    },
    playbutton: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#1DB954',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 1
    },
    stopButton: {
        width: 75,
        height: 75,
        borderRadius: 37.5,
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 1
    },
    playerButtons: {
        flexDirection: 'row',
        zIndex: 1,
        paddingBottom: 40,
        marginTop: 7

    },
    buttonLabel: {
        marginTop: 4,
        fontSize: 15,
        color: 'white',
        fontWeight: '700',
        textAlign: 'center',
        zIndex: 1
    },
    buttonContainer: {
        alignItems: 'center',
        marginHorizontal: 20,
        justifyContent: 'center',
        zIndex: 1
    },
    levelSectionTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10
    },
    levelContentContainer: {
        marginTop: 60,
        marginBottom: 23,
        padding: 10,
        backgroundColor: 'rgb(29, 3, 36)',
        borderRadius: 20,
        boxShadow: 'inset 0 1px 20px 3px rgb(0, 0, 0)',
        margin: 50
    },
    levelSettingsModal: {
        margin: 20,
        backgroundColor: 'rgb(29, 3, 36)',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderRadius: 30,
        borderColor: "rgb(89, 34, 104)",
        borderWidth: 3,
        width: 300,
    },
    levelModalCentered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    levelModalTopLine: {
        alignContent: 'center',
        margin: 10,
    },
    levelTitle: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
        margin: 20,
        textAlignVertical: 'center'
    },
    levelDifficultyText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 20,
        textAlignVertical: 'center',
        marginTop: 7
    },
    levelContainer: {
        flex: 1,
        backgroundColor: 'black',
    },
    levelTopContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: 'rgb(89, 34, 104)'
    },
    levelBottomContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        flex: 8
    },
    

});