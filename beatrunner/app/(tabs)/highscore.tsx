import { globalStyles } from '@/styles/globalStyles';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, FlatList, } from 'react-native';
import { ref, onValue, set, push, orderByChild, orderByValue, orderByKey, limitToLast } from "firebase/database"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { query, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { fetchUserResults } from '@/firebase/scoresService';
import { SegmentedButtons } from 'react-native-paper';

interface UserResults {
  levelId: number;
  userId: number;
  score: number;
  timestamp: number;
}


export default function ScoreScreen() {


  const [userResults, setUserResults] = useState<UserResults[]>([]);
  const [value, setValue] = React.useState(1);
  const [levelNames, setLevelNames] = useState<string[]>([])


  useEffect(() => {
    const getUserdata = async () => {
      const doc = await getDocs(collection(db, "levels"))
      const userResultsData = await fetchUserResults();
      if (levelNames.length == 0) {
        doc.forEach((doc) => {

          levelNames.push(doc.data().title);

        });
      }
      setUserResults(userResultsData);
    }
    getUserdata()

  }, [])



  const getUserResult = (levelId: number) => {
    if (!userResults || userResults.length === 0) {
      return null;
    }

    return userResults.filter(result => result.levelId === levelId);
  };
  let stuff = getUserResult(value)
  console.log(stuff?.sort((a, b) => b.score - a.score));


  return (
    <View style={globalStyles.container}>

      <Text style={globalStyles.title}>Welcome!</Text>

      <Text style={globalStyles.sectionTitle}>Your Highscores</Text>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        buttons={[
          {
            value: 1,
            label: levelNames[0],
          },
          {
            value: 2,
            label: levelNames[1],
          },

        ]}
      />
      <FlatList
        data={stuff}
        renderItem={({ item }) => <View><Text style={styles.scoreText}>  Score: {item.score}</Text></View>}

      />
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