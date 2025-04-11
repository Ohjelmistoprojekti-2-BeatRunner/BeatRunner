import { useDatabase } from '@/hooks/useDatabase';
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
    const { fetchLevels, fetchUserResults } = useDatabase();

    useEffect(() => {
        const getLevels = async () => {
            try {
                const [levelsData, userResultsData] = await Promise.all([
                    fetchLevels(),
                    fetchUserResults(), 
                ]);
                setLevels(levelsData);
                setUserResults(userResultsData);
            } catch (error) {
                console.error("Error loading levels: ", error);
            } finally {
                setLoading(false);
            }
        };

        getLevels();
    }, []);


    const Item = ({ id, title, difficulty, calories, songs }: Level) => {
        const result = userResults.find(result => result.levelId === parseInt(id));
        return(

        <View style={{ margin: 10, width: 300 }}>
            <TouchableOpacity style={globalStyles.button} onPress={() => router.replace({
                pathname: "/level",
                params: { id, title, difficulty, calories, songs }
            })}>
                <Text style={globalStyles.buttonText}>{title}</Text>
                {result && (
                    <Text style={{ color: 'white', marginTop: 5 }}>
                        Score: {result.score} time: {result.timestamp}
                    </Text>
                )}
            </TouchableOpacity>
        </View>
        );
    };


    return (
        <View style={globalStyles.container}>
            <View style={globalStyles.topContainer}>
                <Text style={globalStyles.title}>Welcome!</Text>
            </View>
            <View style={globalStyles.bottomContainer}>

                <Text style={globalStyles.orText}>Choose level</Text>
                <FlatList
                    data={levels}
                    renderItem={({ item }) => <Item id={item.id} title={item.title} difficulty={item.difficulty} calories={item.calories} songs={item.songs}/>}
                />
            </View>
        </View>
    );
}


