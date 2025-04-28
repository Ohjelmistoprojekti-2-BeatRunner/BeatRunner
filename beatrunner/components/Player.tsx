import { useMusicContext } from '@/contexts/MusicContext';
import { useTimerContext } from '@/contexts/TimerContext';
import { useUserContext } from '@/contexts/UserContext';
import { useMusicDetector } from '@/hooks/useMusicDetector';
import { useScores } from '@/hooks/useScores';
import { globalStyles } from '@/styles/globalStyles';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, BackHandler, InteractionManager, Text, TouchableOpacity, View } from 'react-native';
import MusicPlayer from './MusicPlayer';
import StepDetector from './StepDetector';

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

    const [playTime, setPlayTime] = useState(0);
    const requestRef = useRef<number | null>(null);;
    const startTimeRef = useRef<number | null>(null);

    const { songBpm, levelEnd, setLevelEnd } = useMusicContext();

    const { bestScores, loading: userLoading, user } = useUserContext();

    const { startMusicDetector, stopMusicDetector } = useMusicDetector();
    const { score, calculateStepScore, endLevel } = useScores();

    const animate = (time: number) => {
        if (startTimeRef.current !== null) {
            setPlayTime(time - startTimeRef.current);
        }
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (isPlaying) {
            startTimeRef.current = performance.now() - playTime;
            requestRef.current = requestAnimationFrame(animate);
        } else {
            if (requestRef.current !== null) {
                cancelAnimationFrame(requestRef.current);
                requestRef.current = null;
            }
        }

        return () => {
            if (requestRef.current !== null) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [isPlaying]);


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

    // Handles step detection and updates step count, tempo, and score
    const handleStepDetected = (detectedStepCount: number, detectedTempo: number, timestamp: number) => {
        // console.log(`Step Count: ${detectedStepCount}, Tempo: ${detectedTempo}, Time: ${(timestamp / 1000).toFixed(3)}s`);
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
                        endLevel(levelId, playTime);
                        setTimeout(() => {
                            resetTimer()
                            setPlayTime(0)
                            router.replace({ pathname: "/(tabs)" })
                        }, 500);
                    }
                }
            ]
        );
    };

    const gameEnd = () => {
        Alert.alert(
            "Level finished.",
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
                        endLevel(levelId, playTime);
                        setTimeout(() => {
                            resetTimer()
                            setPlayTime(0)
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


    // Handles back button press to either exit or pause the game
    useEffect(() => {
        const backAction = () => {
            pauseTimer();

            if (!started) {
                stopMusicDetector();
                endLevel(levelId, playTime);
                setTimeout(() => {
                    resetTimer();
                    router.replace({ pathname: "/(tabs)" });
                }, 500);
                setStarted(false);
                return true;
            } else {
                askBeforeExit();
                return true;
            }
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => {
            backHandler.remove();
        };
    }, [started]);

    return (
        <View>
            <StepDetector onStepDetected={handleStepDetected} autoStart={isPlaying} />

            <View style={[globalStyles.statContentContainer, { marginLeft: 30, marginRight: 30, marginTop: 30 }]}>
                <View style={globalStyles.statContentRow}>
                    <Text style={[globalStyles.statRowTitle, { fontSize: 20 }]}>Highscore: </Text>
                    <Text style={[globalStyles.statRowText, { fontSize: 20 }]}>{bestScores[levelId]?.score ?? 0} points</Text>
                </View>

            </View>

            <View style={[globalStyles.statContentContainer, { marginLeft: 30, marginRight: 30 }]}>
                <View style={globalStyles.statContentRow}>
                    <Text style={[globalStyles.statRowTitle, { fontSize: 20 }]}>Score:</Text>
                    <Text style={[globalStyles.statRowText, { fontSize: 20 }]}>{score} points</Text>
                </View>
                <View style={globalStyles.statContentRow}>
                    <Text style={[globalStyles.statRowTitle, { fontSize: 20 }]}>Step Count:</Text>
                    <Text style={[globalStyles.statRowText, { fontSize: 20 }]}>{stepCount}</Text>
                </View>
            </View>

            <View style={[globalStyles.statContentContainer, { marginLeft: 30, marginRight: 30 }]}>
                <View style={globalStyles.statContentRow}>
                    <Text style={[globalStyles.statRowTitle, { fontSize: 30 }]}>Time:</Text>
                    <Text style={[globalStyles.statRowText, { fontSize: 30 }]}> {(playTime / 1000).toFixed(2)} s</Text>
                </View>
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
        </View >

    );
};

export default Player;
