import { StyleSheet } from 'react-native';

export const helpStyles = StyleSheet.create({
    slide: {
        padding: 20,
        backgroundColor:'black'
      },
      slideRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 15,
        marginTop: 15
      },
      slideIcon: {
        width: 55,
        height: 55,
        marginRight: 10,
        marginTop: 10,
        resizeMode: 'contain',
      },
      textContainer: {
        flex: 1,
        backgroundColor: 'rgb(24, 3, 29)',
        boxShadow: 'inset 0 1px 20px 3px rgb(0, 0, 0)',
        borderRadius: 20,
      },
      slideHeader: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
        textAlign: 'center'
      },
      slideHeader2: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'white',
      },
      slideText: {
        fontSize: 16,
        color: 'white',
      },
      slideButton: {
        borderWidth: 2,
        borderColor: 'lightblue',
        borderRadius: 10,
        paddingVertical: 6,
        paddingHorizontal: 8,
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 7
      },
      slideButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      slideButtonIcon: {
        marginRight: 8,
        fontSize: 16,
        color: '#fff'
      },
      slideButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
      },
});