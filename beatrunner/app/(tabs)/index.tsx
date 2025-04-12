import { globalStyles } from '@/styles/globalStyles';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { formatTimestamp } from '@/scripts/formatTimestamp';
import { fetchLevels } from '@/firebase/levelsService';
import { fetchUserResults } from '@/firebase/scoresService';

interface Level {
    id: string;
    title: string;
    difficulty: string;
    calories: number;
    songs: [];
}

interface UserResults {
    levelId: number;
    userId: number;
    score: number;
    timestamp: number;
}

export default function HomeScreen() {

    const [levels, setLevels] = useState<Level[]>([]);
    const [userResults, setUserResults] = useState<UserResults[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getLevels = async () => {
            try {
                setLoading(true);

                const levelsData = await fetchLevels();
                const userResultsData = await fetchUserResults();

                setLevels(levelsData);
                setUserResults(userResultsData || []);
            } catch (error) {
                console.error("Error loading levels: ", error);
            } finally {
                setLoading(false);
            }
        };

        getLevels();
    }, []);


    const getUserResult = (levelId: string) => {
        if (!userResults || userResults.length === 0) {
            return null;
        }

        const levelIdInt = parseInt(levelId);
        return userResults.find(result => result.levelId === levelIdInt);
    };

    // get best result from userresults.
    const getUserBestResult = (levelId: string) => {
        const resultsForLevel = userResults.filter(result => result.levelId === parseInt(levelId));

        if (resultsForLevel.length === 0) return null;

        return resultsForLevel.reduce((best, current) => {
            return current.score > best.score ? current : best;
        });
    };

    const Item = ({ id, title, difficulty, calories, songs }: Level) => {
        const bestUserResult = getUserBestResult(id); 
        return (
            <View style={{ margin: 10, width: 300 }}>
                <TouchableOpacity style={globalStyles.button} onPress={() => router.replace({
                    pathname: "/level",
                    params: { id, title, difficulty, calories, songs }
                })}>
                    <Text style={globalStyles.buttonText}>{title}</Text>
                    {bestUserResult && (
                        <Text style={{ color: 'white', marginTop: 5 }}>
                            Best Score: {bestUserResult.score}  {formatTimestamp(bestUserResult.timestamp)}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return <View style={globalStyles.container}>
            <View style={globalStyles.topContainer}>
                <Text style={globalStyles.title}>loading...</Text>
            </View>
        </View>;
    }


    return (
        <View style={globalStyles.container}>
            <View style={globalStyles.topContainer}>
                <Text style={globalStyles.title}>Welcome!</Text>
            </View>
            <View style={globalStyles.bottomContainer}>

                <Text style={globalStyles.orText}>Choose level</Text>
                <FlatList
                    data={levels}
                    renderItem={({ item }) => <Item id={item.id} title={item.title} difficulty={item.difficulty} calories={item.calories} songs={item.songs} />}
                />
            </View>
        </View>
    );
}


