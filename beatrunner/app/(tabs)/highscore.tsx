import { globalStyles } from '@/styles/globalStyles';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, FlatList, } from 'react-native';
import { ref, onValue, set, push, orderByChild, orderByValue, orderByKey, limitToLast } from "firebase/database"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, User } from 'firebase/auth';
import { query, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { fetchUserResults, fetchAllUserResults } from '@/firebase/scoresService';
import { fetchLevels } from '@/firebase/levelsService';
import { fetchAllUsers } from '@/firebase/usersService';
import { SegmentedButtons } from 'react-native-paper';
import { formatTimestamp } from '@/scripts/formatTimestamp';
import { useUserContext } from '@/contexts/UserContext';

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
    const [value, setValue] = React.useState<number>(1);
    const [levels, setLevels] = useState<Levels[]>([])
    const [allUsers, setAllUsers] = useState<Users[]>([])
    const { user, userData, loading } = useUserContext();

    useEffect(() => {
        getData();
    }, []);

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

    const getUserName = (userId: string) => {
        if (!allUsers || allUsers.length == 0) {
            return null
        }
        let userName = allUsers.filter(result => result.id === userId)

        if (userName.length === 0 || !userName[0]) {
            return ""
        } else {
            return userName[0].username
        }

    }
    //allUsersResults.sort((a, b) => b.score - a.score)


    const getLevelResults = (levelId: string) => {
        if (!allUsersResults || allUsersResults.length == 0) {
            return null
        }
        const levelIdInt = parseInt(levelId);
        let level = allUsersResults.filter(result => result.levelId === levelIdInt)



        return level
    }
    //console.log(levels);


    if (loading) {
        return null;
    }

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.sectionTitle}>Highscores</Text>
            <View style={globalStyles.contentContainer}>
                <Text style={styles.scoreText}>{userData?.username}'s stats</Text>
                <Text style={styles.scoreText}>Total steps: {userData?.totalSteps}</Text>
                <Text style={styles.scoreText}>Total time: {userData?.totalTime}</Text>
                <Text style={styles.scoreText}>Total score: {userData?.totalScore}</Text>
            </View>

            {levels.length >= 2 && (
                <SegmentedButtons
                    value={value}
                    onValueChange={setValue}
                    buttons={[
                        {
                            value: 1,
                            label: levels[0].title
                        },
                        {
                            value: 2,
                            label: levels[1].title
                        },

                    ]}
                />
            )}
            <Text style={styles.scoreText}>User     Points      Time</Text>
            <FlatList
                data={getLevelResults(value)}

                renderItem={({ item }) =>
                    <View>
                        <Text style={styles.scoreText}>{getUserName(item.userId)}   {item.score}    {formatTimestamp(item.timestamp)}</Text>
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
});