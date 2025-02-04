import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function HelpScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Help</Text>
            <Text style={styles.sectionTitle}>Common Issues</Text>
            <View style={styles.contentContainer}>
                <Text style={styles.contentText}>Here you can find solutions to common problems...</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        backgroundColor: 'black',
        padding: 20,
        paddingTop: 40,
    },
    sectionTitle: {
        color: 'white',
        fontSize: 20,
        marginTop: 20,
        marginBottom: 10,
        fontWeight: 'bold',
        textAlign: 'center',
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
});