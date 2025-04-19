import { globalStyles } from '@/styles/globalStyles';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, } from 'react-native';
import { ref, onValue, set, push, orderByChild, orderByValue, orderByKey, limitToLast } from "firebase/database"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, User } from 'firebase/auth';
import { query, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { fetchUserResults, fetchAllUserResults } from '@/firebase/scoresService';
import { fetchLevels, Level } from '@/firebase/levelsService';
import { fetchAllUsers, fetchUserByName, fetchUserIdByName, UserProfile } from '@/firebase/usersService';
import { SegmentedButtons } from 'react-native-paper';
import { formatTimestamp } from '@/scripts/formatTimestamp';
import { useUserContext } from '@/contexts/UserContext';
import { router } from 'expo-router';
import ProfileScoresModal from '@/components/ProfileScoresModal';

interface UserResults {
    levelId: number;
    userId: string;
    score: number;
    timestamp: number;
}


export default function ScoreScreen() {

    const [allUsersResults, setAllUsersResults] = useState<UserResults[]>([]);
    const [value, setValue] = React.useState<number>(1);
    const [levels, setLevels] = useState<Level[]>([])
    const [allUsers, setAllUsers] = useState<UserProfile[]>([])

    const [searchTerm, setSearchTerm] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const { user, userData, loading } = useUserContext();

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const levelData = await fetchLevels();
        const userData = await fetchAllUsers();
        const allUsersResultsData = await fetchAllUserResults();

        setLevels(levelData)
        setAllUsers(userData)
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

    const handleProfileModal = async () => {
        if (!searchTerm.trim()) return;

        const userId = await fetchUserIdByName(searchTerm)
        if (userId) {
            setSelectedUserId(userId);
            setModalVisible(true)
        } else {
            alert("User not found")
        }

    };


    if (loading) {
        return null;
    }

    return (

        <View style={globalStyles.container}>
            <View style={{
                flex: 1,
                backgroundColor: '#000000dd'
            }}>
                <View style={{
                    width: '85%',
                    backgroundColor: 'black',
                    borderRadius: 10,
                }}>
                    <TextInput
                        style={globalStyles.input}
                        placeholder="Search username"
                        placeholderTextColor="#888"
                        onChangeText={setSearchTerm}
                    />
                    <TouchableOpacity style={[
                        globalStyles.button
                    ]}
                        onPress={handleProfileModal}>
                        <Text style={globalStyles.buttonText}>Search user</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {levels.length >= 2 && (
                <SegmentedButtons
                    theme={{ roundness: 2 }}
                    style={styles.selector}
                    value={value}
                    onValueChange={setValue}
                    buttons={[
                        {
                            value: 1,
                            label: levels[0].title,
                            uncheckedColor: "white"
                        },
                        {
                            value: 2,
                            label: levels[1].title,
                            uncheckedColor: "white"
                        },
                        {
                            value: 3,
                            label: levels[2].title,
                            uncheckedColor: "white"
                        }

                    ]}
                />
            )}
            <View style={styles.listitems}>
                <Text style={styles.scoreText}>User</Text>
                <Text style={styles.scoreText}>Points</Text>
                <Text style={styles.scoreText}>Time</Text>
            </View>
            <FlatList
                data={getLevelResults(value)}

                renderItem={({ item }) =>
                    <View style={styles.listitems}>
                        <Text style={styles.scoreText}>{getUserName(item.userId)}</Text>
                        <Text style={styles.scoreText}>{item.score}</Text>
                        <Text style={styles.scoreText}>{formatTimestamp(item.timestamp)}</Text>
                    </View>}
            />
            {selectedUserId && (
                <ProfileScoresModal
                    visible={modalVisible}
                    userId={selectedUserId}
                    onClose={() => setModalVisible(false)}
                    mode='profile'
                />
            )}
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
    listitems: {
        flexDirection: "row",
        justifyContent: "space-between",

    },
    selector: {

    }
});