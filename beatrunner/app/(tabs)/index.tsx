import { fetchLevels } from '@/firebase/levelsService';
import { fetchUserBestScores } from '@/firebase/usersService';
import { formatTimestamp } from '@/scripts/formatTimestamp';
import { globalStyles } from '@/styles/globalStyles';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

interface Level {
    id: string;
    title: string;
    difficulty: string;
    calories: number;
    songs: [];
}
interface ScoreData {
    userId: string;
    levelId: string;
    score: number;
    timestamp: number;
}
interface UserResult {
    levelId: string;
    scoreData: ScoreData | null;
}

export default function HomeScreen() {

    const [levels, setLevels] = useState<Level[]>([]);
    const [userResults, setUserResults] = useState<UserResult[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getLevels = async () => {
            try {
                setLoading(true);
                const levelsData = await fetchLevels();
                const userResultsData = await fetchUserBestScores();
                console.log(userResultsData);
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


    const getUserResult = (levelId: string): UserResult | undefined => {
        return userResults.find((r) => r.levelId === levelId);
    };


    const Item = ({ id, title, difficulty, calories, songs }: Level) => {
        const userResult = getUserResult(id);
        return (
            <View style={{ margin: 10, width: 300 }}>
                <TouchableOpacity style={globalStyles.button} onPress={() => router.replace({
                    pathname: "/level",
                    params: { id, title, difficulty, calories, songs }
                })}>
                    <Text style={globalStyles.buttonText}>{title}</Text>
                    {userResult && (
                        <Text style={{ color: 'white', marginTop: 5 }}>
                            Best Score: {userResult.scoreData?.score}  {formatTimestamp(userResult.scoreData?.timestamp)}
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


