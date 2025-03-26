import { useTimerContext } from '@/contexts/TimerContext';
import { useMusicDetector } from '@/hooks/useMusicDetector';
import { globalStyles } from '@/styles/globalStyles';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, BackHandler, Button, FlatList, InteractionManager, ScrollView, Text, View, StyleSheet } from 'react-native';
import MusicPlayer from './MusicPlayer';
import StepDetector from './StepDetector';
import { useMusicContext } from '@/contexts/MusicContext';
import { useEndGame } from '@/hooks/useEndGame';
import { useScores } from '@/hooks/useScores';

const Player = ( { bpm }: { bpm: number } ) => {
    const { time, startTimer, pauseTimer, resetTimer } = useTimerContext();
    const [isPlaying, setIsPlaying] = useState(false);
    const [stepTimestamps, setStepTimestamps] = useState<number[]>([]);
    const [stepCount, setStepCount] = useState(0);
    const [tempo, setTempo] = useState(0);

    const { songPlaying } = useMusicContext();
    const { startMusicDetector, stopMusicDetector } = useMusicDetector();
    const { endGame } = useEndGame();
    const { score, calculateStepScore, endLevel } = useScores();

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

    const handleStepDetected = (detectedStepCount: number, detectedTempo: number, timestamp: number) => {
        console.log(`Step Count: ${detectedStepCount}, Tempo: ${detectedTempo}, Time: ${(timestamp/1000).toFixed(3)}s`);
        calculateStepScore(timestamp, bpm);
        setStepCount(detectedStepCount);
        setTempo(detectedTempo);
        setStepTimestamps(prev => [...prev, timestamp]);
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
                        endLevel();
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
            <StepDetector onStepDetected={handleStepDetected} autoStart={isPlaying} />

            <Text style={globalStyles.contentText}>Step Count: {stepCount}</Text>
            <Text style={globalStyles.contentText}>Tempo: {tempo} SPM</Text>
            <Text style={globalStyles.contentText}> Score: {score} points</Text>

            <MusicPlayer />

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

            <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginVertical: 10 }}>
                Timer: {(time / 1000).toFixed(2)} s
            </Text>

            <View style={styles.timestampContainer}>
                <ScrollView style={styles.timestampScroll}>
                    {stepTimestamps.length > 0 ? (
                        stepTimestamps.slice(-5).map((timestamp, index) => (
                            <Text key={index} style={styles.timestampText}>
                                Step {stepTimestamps.length - 5 + index + 1}: {(timestamp/1000).toFixed(3)}s
                            </Text>
                        ))
                    ) : (
                        <Text style={styles.noTimestampsText}>No steps detected yet</Text>
                    )}
                </ScrollView>
            </View> 
        </View>
    );
};

const styles = StyleSheet.create({ //for testing the timestamps only
    timestampContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 10,
        padding: 15,
        marginHorizontal: 20,
        marginVertical: 10,
        borderColor: '#4CAF50',
        borderWidth: 1,
        maxHeight: 200
    },
    timestampScroll: {
        maxHeight: 150
    },
    timestampText: {
        color: '#4CAF50',
        fontSize: 16,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)'
    },
    noTimestampsText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 16,
        textAlign: 'center',
        fontStyle: 'italic',
        paddingVertical: 10
    }
});

export default Player;
