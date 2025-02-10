import MusicPlayer from '@/components/MusicPlayer';
import { globalStyles } from '@/styles/globalStyles';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

export default function LevelScreen() {

    const { title, difficulty, calories, song } = useLocalSearchParams();

    const params = useLocalSearchParams();
    console.log("Params:", params);


    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>{title}</Text>
            <Text style={globalStyles.contentText}>Difficulty: {difficulty}</Text>
            <Text style={globalStyles.contentText}>Calories: {calories}</Text>
            <MusicPlayer songName={song.toString()} />
        </View >
    )
}