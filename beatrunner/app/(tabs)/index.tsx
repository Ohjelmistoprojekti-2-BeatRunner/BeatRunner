import { useUserContext } from '@/contexts/UserContext';
import { fetchLevels, Level } from '@/firebase/levelsService';
import { formatTimestamp } from '@/scripts/formatTimestamp';
import { globalStyles } from '@/styles/globalStyles';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';


export default function HomeScreen() {

    const { bestScores, loading: userLoading } = useUserContext();
    const [levels, setLevels] = useState<Level[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { user, userData, loading: authLoading } = useUserContext();

    useEffect(() => {
        const getLevels = async () => {
            try {
                setLoading(true);
                const levelsData = await fetchLevels();
                setLevels(levelsData);
            } catch (error) {
                console.error("Error loading levels: ", error);
            } finally {
                setLoading(false);
            }
        };

        getLevels();
    }, []);


    const Item = ({ id, title, difficulty, calories, songs }: Level) => {
        const scoreData = bestScores?.[id];

        const buttonStyle = scoreData ? globalStyles.buttonCompleted : globalStyles.button;
        return (
            <View style={{ margin: 10, width: 300 }}>
                <TouchableOpacity style={buttonStyle} onPress={() => router.replace({
                    pathname: "/level",
                    params: { id, title, difficulty, calories, songs }
                })}>
                    <Text style={globalStyles.buttonText}>{title}</Text>
                    {scoreData && (
                        <Text style={{ color: 'white', marginTop: 5 }}>
                            Best Score: {scoreData.score}  {formatTimestamp(scoreData.timestamp)}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    if (userLoading || loading) {
        return <View style={globalStyles.container}>
            <View style={globalStyles.topContainer}>
                <Text style={globalStyles.title}>loading...</Text>
            </View>
        </View>;
    }


    return (
        <View style={globalStyles.container}>
            <View style={globalStyles.contentContainer}>
                <Text>{userData?.username}'s stats</Text>
                <Text>Total steps: {userData?.totalSteps}</Text>
                <Text>Total time: {userData?.totalTime}</Text>
                <Text>Total score: {userData?.totalScore}</Text>
                <Text>Levels completed: {Object.keys(bestScores).length}</Text>
            </View>
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


