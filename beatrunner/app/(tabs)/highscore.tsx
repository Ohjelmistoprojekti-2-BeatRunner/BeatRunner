import { globalStyles } from '@/styles/globalStyles';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, FlatList, } from 'react-native';
import { database } from '@/firebaseConfig';
import { ref, onValue, set, push, query, orderByChild, orderByValue, orderByKey, limitToLast } from "firebase/database"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

export default function ScoreScreen() {
  const [items, setItems] = useState<number[]>([]);
  const [point, setPoint] = useState<number>(0);
  const [user, setUser] = useState<User | null>(null)
  //console.log(items);


  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);


  const dbRef = ref(database, 'User ' + user?.uid);
  const highScoreRef = ref(database, "User " + user?.uid + "/points")

  const topUserScoreRef = query(ref(database, 'User ' + user?.uid + "/points"), orderByValue());

  function Highscore() {
    push(highScoreRef, point)

  }


  useEffect(() => {

    onValue(topUserScoreRef, (snapshot) => {

      const data: number = snapshot.val();
      //console.log(data); // Handle the data received from the database  
      //console.log(Object.values(data));
      if (data != null) {

        setItems(Object.values(data));
      } else { return }

    });
  }, [user]);

  function compareNumbers(a: number, b: number) {
    return a - b;
  }
  console.log(items.sort(compareNumbers).reverse());

  return (
    <View style={globalStyles.container}>

      <Text style={globalStyles.title}>Welcome!</Text>

      <Text style={globalStyles.sectionTitle}>Your Highscores</Text>
      <FlatList
        ListEmptyComponent={<Text>Empty</Text>}
        style={styles.scoreContainer}
        renderItem={({ item }) =>
          <View>
            <Text style={styles.scoreText}>{item}</Text>
          </View>}
        data={items} />
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