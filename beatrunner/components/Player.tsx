import { useTimerContext } from '@/contexts/TimerContext';
import { useMusicDetector } from '@/hooks/useMusicDetector';
import { useScores } from '@/hooks/useScores';
import { globalStyles } from '@/styles/globalStyles';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, BackHandler, Button, InteractionManager, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import MusicPlayer from './MusicPlayer';
import StepDetector from './StepDetector';
import { useMusicContext } from '@/contexts/MusicContext';
import { useUserContext } from '@/contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { aboutStyles } from '@/styles/aboutStyles';

type PlayerProps = {
    levelId: string;
    songs: string[];
};

const Player = ({ levelId, songs }: PlayerProps) => {
    const { time, startTimer, pauseTimer, resetTimer } = useTimerContext();
    const [isPlaying, setIsPlaying] = useState(false);
    const [stepTimestamps, setStepTimestamps] = useState<number[]>([]);
    const [stepCount, setStepCount] = useState(0);
    const [tempo, setTempo] = useState(0);
    const [started, setStarted] = useState(false);

    const { songBpm, levelEnd, setLevelEnd } = useMusicContext();

    const { bestScores, loading: userLoading, user } = useUserContext();

    const { startMusicDetector, stopMusicDetector } = useMusicDetector();
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

        if (started === false) {
            setStarted(true);
        }

        InteractionManager.runAfterInteractions(() => {
            if (!isPlaying) {
                startMusicDetector();
            } else {
                stopMusicDetector();
            }
        });
    };

    const handleStepDetected = (detectedStepCount: number, detectedTempo: number, timestamp: number) => {
        console.log(`Step Count: ${detectedStepCount}, Tempo: ${detectedTempo}, Time: ${(timestamp / 1000).toFixed(3)}s`);
        calculateStepScore(timestamp, songBpm);
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
                        endLevel(levelId);
                        setTimeout(() => {
                            resetTimer()
                            router.replace({ pathname: "/(tabs)" })
                        }, 500);
                    }
                }
            ]
        );
    };

    const gameEnd = () => {
        Alert.alert(
            "Level passed.",
            `${bestScores[levelId]?.score && score > bestScores[levelId]?.score ?
                `New highscore! ${score}` :
                `Your score was: ${score}`
            }`,
            [
                {
                    text: "Exit",
                    onPress: () => {
                        pauseTimer();
                        setLevelEnd(false);
                        endLevel(levelId);
                        setTimeout(() => {
                            resetTimer()
                            router.replace({ pathname: "/(tabs)" })
                        }, 500);
                    }
                }
            ]
        );
    };

    useEffect(() => {
        if (levelEnd) {
            stopMusicDetector();
            gameEnd();
        }
    }, [levelEnd]);


    useEffect(() => {
        const backAction = () => {
            pauseTimer();
            askBeforeExit();
            return true;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => {
            backHandler.remove();
        };
    }, []);

    return (
        <View>

            {/* 
       <Text style={globalStyles.contentText}>Step Count: {stepCount}</Text>
        <Text style={globalStyles.contentText}>Tempo: {tempo} SPM</Text>
        <Text style={globalStyles.contentText}> Score: {score} points</Text>

        <Text style={globalStyles.contentText}> Songs bpm: {songBpm} </Text>

          */}

            <StepDetector onStepDetected={handleStepDetected} autoStart={isPlaying} />

            <View style={globalStyles.levelContentContainer}>
                <Text style={globalStyles.levelSectionTitle}> Score: {score} points</Text>
                <Text style={globalStyles.levelSectionTitle}> Time: {(time / 1000).toFixed(2)} s </Text>
                <Text style={globalStyles.levelSectionTitle}> Step Count: {stepCount} </Text>
            </View>

            <View style={{ justifyContent: 'flex-end', flex: 1 }}>
                <View style={globalStyles.playerContainer}>

                    <MusicPlayer songs={songs} />

                    <View style={globalStyles.playerButtons}>

                        <View style={{ width: 90 }} />

                        <View style={globalStyles.buttonContainer}>
                            <TouchableOpacity style={globalStyles.playbutton} onPress={togglePlayPause}>
                                <Ionicons name={isPlaying ? "pause" : "play"} size={45} color="white" />
                            </TouchableOpacity>
                            <Text style={globalStyles.buttonLabel}>{isPlaying ? "Pause level" : "Start level"}</Text>
                        </View>


                        <View style={globalStyles.buttonContainer}>
                            <TouchableOpacity style={globalStyles.stopButton} onPress={askBeforeExit}>
                                <Ionicons name="stop" size={28} color="white" />
                            </TouchableOpacity>
                            <Text style={globalStyles.buttonLabel}>End level</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>

    );
};

export default Player;
