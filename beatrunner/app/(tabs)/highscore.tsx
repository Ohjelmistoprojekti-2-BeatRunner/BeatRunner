import { globalStyles } from '@/styles/globalStyles';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, } from 'react-native';
import { ref, onValue, set, push, orderByChild, orderByValue, orderByKey, limitToLast } from "firebase/database"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, User } from 'firebase/auth';
import { query, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { fetchUserResults, fetchAllUserResults } from '@/firebase/scoresService';
import { fetchLevels } from '@/firebase/levelsService';
import { fetchAllUsers, fetchUserByName, getUserIdByName } from '@/firebase/usersService';
import { SegmentedButtons } from 'react-native-paper';
import { formatTimestamp } from '@/scripts/formatTimestamp';
import { useUserContext } from '@/contexts/UserContext';
import { router } from 'expo-router';

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
    const [searchTerm, setSearchTerm] = useState('');

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

    const handleRouteToProfile = async () => {
        if (!searchTerm.trim()) return;

        const userId = await getUserIdByName(searchTerm)
        if (!userId) {
            console.log("User not found")
            return;
        };
        console.log("UserId", userId);
        router.replace({
            pathname: "/profile",
            params: { userId }
        });
    };


    if (loading) {
        return null;
    }

    return (

        <View style={globalStyles.container}>
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#000000dd'
            }}>
                <View style={{
                    width: '85%',
                    backgroundColor: 'black',
                    borderRadius: 10,
                    padding: 20
                }}>
                    <Text style={[globalStyles.title, { paddingBottom: 10 }]}>Find user</Text>
                    <TextInput
                        style={globalStyles.input}
                        placeholder="Username"
                        placeholderTextColor="#888"
                        onChangeText={setSearchTerm}
                    />
                    <TouchableOpacity style={[
                        globalStyles.smallButton,
                        { marginTop: 10 }
                    ]}
                        onPress={handleRouteToProfile}>
                        <Text style={globalStyles.buttonText}>Search user</Text>
                    </TouchableOpacity>
                </View>
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