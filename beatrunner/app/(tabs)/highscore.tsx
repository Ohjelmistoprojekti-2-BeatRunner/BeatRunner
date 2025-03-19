import { globalStyles } from '@/styles/globalStyles';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { database } from '@/firebaseConfig';
import { ref, onValue, set } from "firebase/database"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

export default function ScoreScreen() {

  const [user, setUser] = useState<User | null>(null)
  //console.log(user?.uid);

  useEffect(() => {
    let getAllKeys = async () => {
      let keys: readonly string[] = []

      let storedUser

      try {
        keys = await AsyncStorage.getAllKeys()
      } catch (e) {
        // read key error
      }
      try {
        storedUser = await AsyncStorage.getItem(keys[0])
        storedUser = storedUser != null ? JSON.parse(storedUser) : null
        setUser(storedUser)

      } catch (e) {
        // read error
      }

    }
    getAllKeys()
  }, [])

  const dbRef = ref(database, 'Score ' + user?.uid); // Replace 'your-data-path'

  function Highscore(point: number) {

    set(dbRef, { point: point })
  }

  //Highscore(15)

  onValue(dbRef, (snapshot) => {

    const data = snapshot.val();

    console.log(data); // Handle the data received from the database

  });

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