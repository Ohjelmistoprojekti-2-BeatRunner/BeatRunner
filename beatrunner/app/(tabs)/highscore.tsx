import { globalStyles } from '@/styles/globalStyles';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, FlatList, } from 'react-native';
import { ref, onValue, set, push, orderByChild, orderByValue, orderByKey, limitToLast } from "firebase/database"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { query, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { fetchUserResults, fetchAllUserResults } from '@/firebase/scoresService';
import { fetchLevels } from '@/firebase/levelsService';
import { fetchAllUsers } from '@/firebase/usersService';
import { SegmentedButtons } from 'react-native-paper';
import { formatTimestamp } from '@/scripts/formatTimestamp';

interface UserResults {
  levelId: number;
  userId: string;
  score: number;
  timestamp: number;
}
interface Users {
  id: string;
  createdAt: number;
  email: string;
  username: string;
}
interface Levels {
  id: string;
  title: string;
  difficulty: any;
  calories: any;
  songs: any;
}

export default function ScoreScreen() {

  const [allUsersResults, setAllUsersResults] = useState<UserResults[]>([]);
  //const [userResults, setUserResults] = useState<UserResults[]>([]);
  //const [value, setValue] = React.useState(1);
  const [levels, setLevels] = useState<Levels[]>([])
  const [allUsers, setAllUsers] = useState<Users[]>([])


  const getData = async () => {
    const levelData = await fetchLevels();
    const userData = await fetchAllUsers();
    //const userResultsData = await fetchUserResults();
    const allUsersResultsData = await fetchAllUserResults();

    setLevels(levelData)
    setAllUsers(userData)
    //setUserResults(userResultsData);
    setAllUsersResults(allUsersResultsData)
  }
  getData()




  /* 
    const getUserResult = (levelId: number) => {
      if (!userResults || userResults.length === 0) {
        return null;
      }
  
      return userResults.filter(result => result.levelId === levelId);
    };
    let stuff = getUserResult(value)
    // console.log(stuff?.sort((a, b) => b.score - a.score));
  */
  const getUserName = (userId: string) => {
    if (!allUsers || allUsers.length == 0) {
      return null
    }
    let userName = allUsers.filter(result => result.id === userId)

    if (userName == undefined) {
      return ""
    } else {
      return userName[0].username
    }

  }
  //allUsersResults.sort((a, b) => b.score - a.score)


  const getLevelName = (levelId: string) => {
    if (!levels || levels.length == 0) {
      return null
    }
    const levelIdInt = parseInt(levelId);
    let levelName = levels.filter(result => parseInt(result.id) === levelIdInt)

    return levelName[0].title
  }
  //console.log(levels);

  return (
    <View style={globalStyles.container}>

      <Text style={globalStyles.title}>Welcome!</Text>

      <Text style={globalStyles.sectionTitle}>Global Highscores</Text>
      <Text style={styles.scoreText}>User    Level     Points      Time</Text>
      <FlatList
        data={allUsersResults}

        renderItem={({ item }) =>
          <View>
            <Text style={styles.scoreText}>{getUserName(item.userId)}   {getLevelName(item.levelId)}  {item.score}    {formatTimestamp(item.timestamp)}</Text>
          </View>}

      />
    </View>
  );
}
/*  varastossa
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
      /> */

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