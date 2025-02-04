import { globalStyles } from '@/styles/globalStyles';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ScoreScreen() {
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Welcome!</Text>
            <Text style={globalStyles.sectionTitle}>Top 3</Text>
    
            <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>1. 1000</Text>
            <Text style={styles.scoreText}>2. 900</Text>
            <Text style={styles.scoreText}>3. 800</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({ 
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