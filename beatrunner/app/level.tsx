
import Player from '@/components/Player';
import { globalStyles } from '@/styles/globalStyles';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';


export default function LevelScreen() {

    const { id, title, difficulty, calories, songs } = useLocalSearchParams();

    const levelId = Array.isArray(id) ? id[0] : id;


    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>{title}</Text>
            <Text style={globalStyles.contentText}>Difficulty: {difficulty}</Text>
            <Text style={globalStyles.contentText}>Calories: {calories}</Text>
            <Player levelId={levelId} 
                    songs={Array.isArray(songs) ? songs : [songs]}/>

        </View >
    )
}
