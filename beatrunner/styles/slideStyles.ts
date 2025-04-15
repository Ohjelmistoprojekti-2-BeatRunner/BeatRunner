import { StyleSheet } from 'react-native';

export const slideStyles = StyleSheet.create({
    slide: {
        padding: 20,
      },
      slideRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 15,
        marginTop: 15
      },
      slideIcon: {
        width: 75,
        height: 75,
        marginRight: 10,
        marginTop: 10,
        resizeMode: 'contain',
      },
      textContainer: {
        flex: 1,
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