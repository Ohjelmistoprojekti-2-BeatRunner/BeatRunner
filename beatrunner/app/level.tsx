
import { globalStyles } from '@/styles/globalStyles';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useMusicContext } from '../contexts/MusicContext';
import StepDetector from '@/components/StepDetector';

export default function LevelScreen() {

    const { id, title, bpm, difficulty, calories } = useLocalSearchParams();
    const { setCurrentSong } = useMusicContext();

    
    useEffect(() => {
        const songName = Array.isArray(id) ? id[0] : id;
        setCurrentSong(songName);
    }, [id, setCurrentSong]); 


    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>{title}</Text>
            <Text style={globalStyles.contentText}>Difficulty: {difficulty}</Text>
            <Text style={globalStyles.contentText}>Calories: {calories}</Text>
            <StepDetector />

        </View >
    )
}