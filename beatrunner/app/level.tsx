
import Player from '@/components/Player';
import { globalStyles } from '@/styles/globalStyles';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text, View, StyleSheet, TextStyle } from 'react-native';


export default function LevelScreen() {

    const { id, title, difficulty, calories, songs } = useLocalSearchParams();

    const levelId = Array.isArray(id) ? id[0] : id;

    const getColorForDifficulty = (difficulty: string): TextStyle => {
        switch (difficulty) {
            case "easy":
                return { color: '#64b55b' };
            case "moderate":
                return { color: '#e6c353' };
            case "hard":
                return { color: '#de6f80' };
            default:
                return { color: 'white' };
        }
    }


    return (
        <View style={globalStyles.levelContainer}>
            <View style={globalStyles.levelTopContainer}>
            <Text style={globalStyles.levelTitle}>{title}</Text>
            <Text style={[getColorForDifficulty(difficulty.toString()), globalStyles.levelDifficultyText]}>{difficulty}</Text>
            </View>
            <View style={globalStyles.levelBottomContainer}>
            <Player levelId={levelId} 
                    songs={Array.isArray(songs) ? songs : [songs]}/>
            </View>

        </View >
    )
}