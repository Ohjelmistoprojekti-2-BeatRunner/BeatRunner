import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function ScoreScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome!</Text>
            <Text style={styles.sectionTitle}>Top 3</Text>
    
            <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>1. 1000</Text>
            <Text style={styles.scoreText}>2. 900</Text>
            <Text style={styles.scoreText}>3. 800</Text>
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
    scoreContainer: {
      marginTop: 20,
      padding: 10,
      backgroundColor: '#333',
      borderRadius: 10,
    },
    scoreText: {
      color: 'white',
      fontSize: 18,
      marginVertical: 5,
    },
  });