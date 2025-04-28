
import Player from '@/components/Player';
import { globalStyles } from '@/styles/globalStyles';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text, TextStyle, View } from 'react-native';


export default function LevelScreen() {

    const { id, title, difficulty, calories, songs, duration } = useLocalSearchParams();

    const levelId = Array.isArray(id) ? id[0] : id;


    const getColorForDifficulty = (difficulty: string): TextStyle => {
        switch (difficulty.split(" ")[0]) {
            case "Easy":
                return { color: '#64b55b' };
            case "Medium":
                return { color: '#e6c353' };
            case "Hard":
                return { color: '#de6f80' };
            case "Impossible":
                return { color: '#ab1dab' }
            default:
                return { color: 'white' };
        }
    }


    return (
        <View style={globalStyles.levelContainer}>
            <View style={[globalStyles.levelTopContainer, {flexDirection: 'row', alignItems: 'center' }]}>
                <Text style={globalStyles.levelTitle}>{title}</Text>
                <View>
                    <Text style={[getColorForDifficulty(difficulty.toString()), globalStyles.levelDifficultyText]}>{difficulty}</Text>
                    <Text style={[getColorForDifficulty(difficulty.toString()), globalStyles.levelDifficultyText]}>{duration} min</Text>
                </View>
            </View>
            <View style={globalStyles.levelBottomContainer}>
                <Player levelId={levelId}
                    songs={Array.isArray(songs) ? songs : [songs]} />
            </View>

        </View >
    )
}