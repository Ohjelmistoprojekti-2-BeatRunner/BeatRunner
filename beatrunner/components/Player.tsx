import { useTimerContext } from '@/contexts/TimerContext'; // Import the fixed TimerContext
import { useMusicDetector } from '@/hooks/useMusicDetector';
import { globalStyles } from '@/styles/globalStyles';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, BackHandler, Button, InteractionManager, Text, View } from 'react-native';
import MusicPlayer from './MusicPlayer';
import StepDetector from './StepDetector';
import { useMusicContext } from '@/contexts/MusicContext';
import { useEndGame } from '@/hooks/useEndGame';

const Player = () => {
    const { time, startTimer, pauseTimer, resetTimer } = useTimerContext(); // Use the fixed timer context
    const [isPlaying, setIsPlaying] = useState(false);

    const { songPlaying } = useMusicContext();
    const { startMusicDetector, stopMusicDetector } = useMusicDetector();
    const { endGame } = useEndGame();

    useEffect(() => {
        if (isPlaying) {
            startTimer(); 
        } else {
            pauseTimer(); 
        }

        return () => {
            pauseTimer(); 
        };
    }, [isPlaying, startTimer, pauseTimer]);

    const togglePlayPause = () => {
        setIsPlaying((prev) => !prev);

        InteractionManager.runAfterInteractions(() => {
            if (!isPlaying) {
                startMusicDetector();
            } else {
                stopMusicDetector();
            }
        });
    };

    const askBeforeExit = () => {
        Alert.alert(
            "Are you sure?",
            "You are playing a game. Do you want to stop and exit?",
            [
                { text: "Stay", onPress: () => null },
                {
                    text: "Exit",
                    onPress: () => {
                        stopMusicDetector();
                        pauseTimer();
                        setTimeout(() => {
                            router.back();
                        }, 500);
                    }
                }
            ]
        );
    };

    useEffect(() => {
        const backAction = () => {
            askBeforeExit();
            return true;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => {
            backHandler.remove();
        };
    }, []);

    return (
        <View style={globalStyles.container}>
            <StepDetector onStepDetected={(stepCount, tempo) => {
                console.log(`Step Count: ${stepCount}, Tempo: ${tempo}`);
            }} />

            <MusicPlayer />

            {/* Display elapsed game time correctly */}
            <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginVertical: 10 }}>
                Timer: {(time / 1000).toFixed(2)} s
            </Text>

            <Button
                title={isPlaying ? 'Pause Both' : 'Play Both'}
                onPress={togglePlayPause}
                color="#4CAF50"
            />

            <Button
                title={'End game'}
                onPress={endGame}
                color="#4CAF50"
            />

        </View>
    );
};

export default Player;
