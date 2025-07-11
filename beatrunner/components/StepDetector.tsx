import { useMusicContext } from '@/contexts/MusicContext';
import { useStepDetectorContext } from '@/contexts/StepDetectorContext';
import { useTimerContext } from '@/contexts/TimerContext';
import { useUserContext } from '@/contexts/UserContext';
import { updateUserThreshold } from '@/firebase/usersService';
import { globalStyles } from '@/styles/globalStyles';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { Accelerometer } from 'expo-sensors';
import React, { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface StepDetectorProps {
    onStepDetected?: (stepCount: number, tempo: number, timestamp: number) => void;
    autoStart?: boolean;
}

const StepDetector: React.FC<StepDetectorProps> = ({ onStepDetected, autoStart = false }) => {
    const { isDetecting, threshold, setThreshold, tempo, setTempo, stepCount, setStepCount } = useStepDetectorContext();
    const { songBpm } = useMusicContext();
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [stepTimestamps, setStepTimestamps] = useState<number[]>([]);
    const currentTempoRef = useRef<number>(0);
    const [localThreshold, setLocalThreshold] = useState(threshold);
    const [modalVisible, setModalVisible] = useState(false);
    const [stepSoundEnabled, setStepSoundEnabled] = useState(false);
    const stepSoundEnabledRef = useRef(false);

    const { user } = useUserContext();

    const localStepCountRef = useRef<number>(0);

    const { time, getCurrentTime } = useTimerContext();

    // References for step detection
    const accelerationRef = useRef({ x: 0, y: 0, z: 0 }); // Not in use
    const lastStepTimeRef = useRef<number>(0);
    const stepTimesRef = useRef<number[]>([]);
    const isInInactiveStateRef = useRef(false);
    const subscriptionRef = useRef<any>(null);

    const animatedStepOpacity = useSharedValue(1);

    // Load sound effect for step detection
    useEffect(() => {
        async function loadSound() {
            try {
                const { sound } = await Audio.Sound.createAsync(
                    require('@/assets/sounds/step.mp3')
                );
                setSound(sound);
            } catch (error) {
                console.error("Error loading sound:", error);
            }
        }
        loadSound();
        return () => {
            if (sound) {
                sound.unloadAsync(); // Clean up sound resource on unmount
            }
        };
    }, []);

    const [detectingSteps, setDetectingSteps] = useState(false); // Flag to track if we're actively listening for steps (regardless of autoStart)

    // Manage step detection based on autoStart or step sound toggle
    useEffect(() => {
        const shouldDetectSteps = autoStart || stepSoundEnabled;
        if (shouldDetectSteps && !subscriptionRef.current) {
            startStepDetection();
        }
        else if (!shouldDetectSteps && subscriptionRef.current) {
            stopStepDetection();
        }
        return () => {
            if (subscriptionRef.current) {
                console.log("Cleaning up step detection on unmount");
                stopStepDetection();
            }
        };
    }, [autoStart, stepSoundEnabled]);

    // Start listening to accelerometer data for step detection
    const startStepDetection = async () => {
        if (autoStart) {
            // Reset counters and state for a new game session
            setStepCount(0);
            localStepCountRef.current = 0;
            setTempo(0);
            currentTempoRef.current = 0;
            stepTimesRef.current = [];
            setStepTimestamps([]);
        }
        Accelerometer.setUpdateInterval(20); // Set accelerometer update interval (~50Hz)
        setDetectingSteps(true);
        subscriptionRef.current = Accelerometer.addListener(data => {
            processAccelerometerData(data);
        });
    };

    // Stop listening to accelerometer data
    const stopStepDetection = () => {
        if (subscriptionRef.current) {
            subscriptionRef.current.remove();
            subscriptionRef.current = null;
            setDetectingSteps(false);
        }
    };

    // Process accelerometer data to detect steps
    const processAccelerometerData = async (data: any) => {
        const { x, y, z } = data;
        const magnitude = Math.sqrt(x * x + y * y + z * z);
        const now = Date.now();

        // Calculate the minimum step interval based on the song's BPM
        const currentBpm = songBpm > 0 ? songBpm : (tempo > 0 ? tempo : 120); // Default to 120 BPM if no BPM and tempo is set
        const beatInterval = 60000 / currentBpm; // Time for one beat in milliseconds
        const minimumStepInterval = beatInterval * 0.45; // 45% of the beat interval

        if (isInInactiveStateRef.current) { // Avoid detecting multiple steps for a single movement
            const inactiveTime = now - lastStepTimeRef.current;
            if (inactiveTime > minimumStepInterval) {
                isInInactiveStateRef.current = false;
            } else {
                return;
            }
        }

        if (magnitude > threshold) {
            animatedStepOpacity.value = withTiming(0.2, { duration: 100 }, () => { // Animate step indicator
                animatedStepOpacity.value = withTiming(1, { duration: 100 });
            });

            if (sound && stepSoundEnabledRef.current) { // Play step sound if enabled
                try {
                    await sound.replayAsync();
                } catch (error) {
                    console.warn("Could not play step sound", error);
                }
            }

            if (autoStart) {
                const preciseTimestamp = getCurrentTime();
                const newStepTimestamps = [...stepTimestamps, preciseTimestamp];
                setStepTimestamps(newStepTimestamps);

                // Calculate step intervals and update tempo
                if (lastStepTimeRef.current > 0) {
                    const interval = now - lastStepTimeRef.current;
                    stepTimesRef.current.push(interval);

                    // Keep only the last 5 steps for a rolling average
                    if (stepTimesRef.current.length > 5) {
                        stepTimesRef.current.shift();
                    }
                    if (stepTimesRef.current.length > 0) {
                        const avgInterval = stepTimesRef.current.reduce((sum, val) => sum + val, 0) / stepTimesRef.current.length;
                        const newTempo = Math.round(60000 / avgInterval);
                        currentTempoRef.current = newTempo;
                        setTempo(newTempo);
                    }
                }
                // Update step count and notify parent component
                localStepCountRef.current += 1;
                setStepCount(localStepCountRef.current);
                if (onStepDetected) {
                    onStepDetected(localStepCountRef.current, currentTempoRef.current, preciseTimestamp);
                }
            }
            // Enter inactive state to prevent duplicate step detection
            lastStepTimeRef.current = now;
            isInInactiveStateRef.current = true;
        }
    };

    // Animated style for step indicator
    const stepIndicatorStyle = useAnimatedStyle(() => {
        return {
            opacity: animatedStepOpacity.value
        };
    });

    // Handle sensitivity slider value change
    const handleValueChange = (value: number) => {
        setLocalThreshold(value);
    };

    // Save sensitivity value to database after sliding is complete
    const handleSlidingComplete = (value: number) => {
        if (user) updateUserThreshold(value);
        setThreshold(value);
        setLocalThreshold(value);
    };

    const toggleStepSound = () => {
        setStepSoundEnabled(previous => {
            const newValue = !previous;
            return newValue;
        });
    };

    useEffect(() => {
        stepSoundEnabledRef.current = stepSoundEnabled; // Sync ref with state
    }, [stepSoundEnabled]);

    return (
        <View>
            <Modal
                animationType='slide'
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                {/*Close Modal on press outside modal box*/}
                <Pressable style={StyleSheet.absoluteFill} onPress={() => setModalVisible(false)} />
                <View style={globalStyles.levelModalCentered}>
                    <View style={globalStyles.levelSettingsModal}>

                        <View style={globalStyles.levelModalTopLine}>
                            <Text style={globalStyles.playerHeader}>Settings</Text>
                        </View>

                        <Animated.View style={[styles.stepIndicator, stepIndicatorStyle]} />

                        {/* Sensitivity slider UI */}
                        <View style={styles.controlsContainer}>
                            <Text style={globalStyles.contentText}>Sensitivity: {threshold.toFixed(2)}</Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={0.5}
                                maximumValue={2.0}
                                step={0.1}
                                value={localThreshold}
                                onValueChange={handleValueChange}
                                onSlidingComplete={handleSlidingComplete}
                                minimumTrackTintColor="#4CAF50"
                                maximumTrackTintColor="#000000"
                            />
                        </View>

                        {/* Step sound toggle UI */}
                        <View style={styles.toggleContainer}>
                            <View style={styles.toggleRow}>
                                <TouchableOpacity
                                    style={[
                                        styles.toggleButton,
                                        stepSoundEnabled ? styles.toggleButtonActive : styles.toggleButtonInactive
                                    ]}
                                    onPress={() => {
                                        console.log("Touch event on toggle button");
                                        toggleStepSound();
                                    }}
                                >
                                    <Ionicons
                                        name={stepSoundEnabled ? "volume-high" : "volume-mute"}
                                        size={22}
                                        color="white"
                                    />
                                    <Text style={styles.toggleText}>
                                        {stepSoundEnabled ? "Steps Sound On" : "Steps Sound Off"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[globalStyles.smallButton, { flexDirection: 'row', gap: 10, margin: 20 }]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Ionicons name="close" size={25} color="white" />
                            <Text style={globalStyles.buttonText}>Close settings</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>

            <View style={globalStyles.buttonContainer}>
                <TouchableOpacity
                    style={[globalStyles.smallButton, { flexDirection: 'row', gap: 10 }]}
                    onPress={() => setModalVisible(true)}
                >
                    <Ionicons name="settings-outline" size={25} color="white" />
                    <Text style={globalStyles.buttonText}>Settings</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    stepIndicator: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#4CAF50',
        marginBottom: 10,
        alignSelf: 'center'
    },
    controlsContainer: {
        marginTop: 30,
        width: '100%',
        alignItems: 'center'
    },
    slider: {
        width: 280,
        height: 40
    },
    timestampContainer: {
        marginTop: 10,
        alignItems: 'center'
    },
    toggleContainer: {
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    toggleRow: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        width: '100%',
        justifyContent: 'center',
    },
    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 30,
        gap: 10,
        minWidth: 180,
    },
    toggleButtonActive: {
        backgroundColor: '#4CAF50',
    },
    toggleButtonInactive: {
        backgroundColor: '#555555',
    },
    toggleText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default StepDetector;