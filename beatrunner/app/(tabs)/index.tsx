import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
      <Text style={styles.title}>Welcome!</Text>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={() => { /* TODO: Add functionality */ }}>
          <Text style={styles.buttonText}>Choose Level</Text>
        </TouchableOpacity>
        <Text style={styles.orText}>OR</Text>
        <TouchableOpacity style={styles.button} onPress={() => { /* TODO: Add functionality */ }}>
          <Text style={styles.buttonText}>Custom Level</Text>
        </TouchableOpacity>
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
  buttonText: {
    color: 'white',
    fontSize: 24,
  },
  orText: {
    color: 'white',
    fontSize: 24,
    marginVertical: 10,
  },
});