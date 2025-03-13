import { useMusicContext } from '@/contexts/MusicContext';
import { useStepDetector } from '@/contexts/StepDetectorContext';
import { globalStyles } from '@/styles/globalStyles';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, BackHandler, Button, StyleSheet, Text, View } from 'react-native';
import MusicPlayer from './MusicPlayer';
import StepDetector from './StepDetector';
import { useMusicDetector } from '@/hooks/useMusicDetector';


const Player = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    const { isDetecting } = useStepDetector();
    const { songPlaying, currentTime } = useMusicContext();
    const { startMusicDetector, stopMusicDetector } = useMusicDetector();

    console.log("is playing: ", isDetecting);
    console.log("is detecting: ", isDetecting);
    console.log("song playing: ", songPlaying);
    console.log("song time: ", currentTime);


    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
        if (isPlaying) {
            stopMusicDetector();
        } else {
            startMusicDetector();
        }
    };

    const askBeforeExit = () => {
        Alert.alert(
            "Are you sure?",
            "You are playing game. Do you want to stop and exit?",
            [
                {
                    text: "Stay",
                    onPress: () => null
                },
                {
                    text: "Exit",
                    onPress: () => {
                        stopMusicDetector();
                        setTimeout(() => { // Delay to make sure both components have time to close.
                            router.back(); // Navigate back to the previous screen
                        }, 500);
                    }
                }
            ]
        );
    };

    // Handling Android back button press
    useEffect(() => {
        const backAction = () => {
            askBeforeExit();
            return true;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove();
    }, []);


    return (
        <View style={globalStyles.container}>

                <StepDetector onStepDetected={(stepCount, tempo) => {
                console.log(`Step Count: ${stepCount}, Tempo: ${tempo}`);
            }} />

            <MusicPlayer />

            <Button
                title={isPlaying ? 'Pause Both' : 'Play Both'}
                onPress={togglePlayPause}
                color="#4CAF50"
            />
        </View>
    );
};


export default Player;