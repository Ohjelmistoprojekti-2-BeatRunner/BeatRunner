import { globalStyles } from '@/styles/globalStyles';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, FlatList, } from 'react-native';
import { fetchAllUserResults } from '@/firebase/scoresService';
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
  const [value, setValue] = React.useState<number>(1);
  const [levels, setLevels] = useState<Levels[]>([])
  const [allUsers, setAllUsers] = useState<Users[]>([])


  const getData = async () => {
    const levelData = await fetchLevels();
    const userData = await fetchAllUsers();
    const allUsersResultsData = await fetchAllUserResults();

    setLevels(levelData)
    setAllUsers(userData)
    setAllUsersResults(allUsersResultsData)
  }
  useEffect(() => { getData() }, [])
  //getData()


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


  const getLevel = (levelId: string) => {
    if (!allUsersResults || allUsersResults.length == 0) {
      return null
    }
    const levelIdInt = parseInt(levelId);
    let level = allUsersResults.filter(result => parseInt(result.levelId) === levelIdInt)



    return level
  }
  //console.log(levels);

  return (
    <View style={globalStyles.container}>

      <Text style={globalStyles.title}>Welcome!</Text>

      <Text style={globalStyles.sectionTitle}>Highscores</Text>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        buttons={[
          {
            value: 1,
            label: levels.length != 0 ? levels[0].title : "Level name 1"
          },
          {
            value: 2,
            label: levels.length != 0 ? levels[1].title : "Level name 2"
          },

        ]}
      />
      <Text style={styles.scoreText}>User     Points      Time</Text>
      <FlatList
        data={getLevel(value)}

        renderItem={({ item }) =>
          <View style={styles.scoreList}>
            <Text style={styles.scoreText}>{getUserName(item.userId)}</Text>
            <Text style={styles.scoreText}>{item.score}</Text>
            <Text style={styles.scoreText}>{formatTimestamp(item.timestamp)}</Text>
          </View>}

      />
    </View>
  );
}
/*  varastossa
 */

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
  scoreList: {
    backgroundColor: "gray",
    flexDirection: "row",
  },
});