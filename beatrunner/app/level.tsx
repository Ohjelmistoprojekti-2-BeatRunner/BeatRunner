import MusicPlayer from '@/components/MusicPlayer';
import { globalStyles } from '@/styles/globalStyles';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

export default function LevelScreen() {

    const { id, title, difficulty, calories } = useLocalSearchParams();

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>{title}</Text>
            <Text style={globalStyles.contentText}>Difficulty: {difficulty}</Text>
            <Text style={globalStyles.contentText}>Calories: {calories}</Text>
            <MusicPlayer id={id.toString()} />
        </View >
    )
}