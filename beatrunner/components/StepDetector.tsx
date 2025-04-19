import { useStepDetectorContext } from '@/contexts/StepDetectorContext';
import { useTimerContext } from '@/contexts/TimerContext'; // Import TimerContext
import { updateUserThreshold } from '@/firebase/usersService';
import { globalStyles } from '@/styles/globalStyles';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { Accelerometer } from 'expo-sensors';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useUserContext } from '@/contexts/UserContext';

interface StepDetectorProps {
    onStepDetected?: (stepCount: number, tempo: number, timestamp: number) => void;
    autoStart?: boolean;
}

const StepDetector: React.FC<StepDetectorProps> = ({ onStepDetected, autoStart = false }) => {
    // StepDetectorContext variables
    const { isDetecting, threshold, setThreshold, tempo, setTempo, stepCount, setStepCount } = useStepDetectorContext();
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [stepTimestamps, setStepTimestamps] = useState<number[]>([]);
    const currentTempoRef = useRef<number>(0);
    const [localThreshold, setLocalThreshold] = useState(threshold); // For threshold-slider ui

    const { user } = useUserContext();

    const localStepCountRef = useRef<number>(0);

    // Get timer from TimerContext
    const { time, getCurrentTime } = useTimerContext();

    // References for step detection
    const accelerationRef = useRef({ x: 0, y: 0, z: 0 }); // Not in use
    const lastStepTimeRef = useRef<number>(0);
    const stepTimesRef = useRef<number[]>([]);
    const isInInactiveStateRef = useRef(false);
    const subscriptionRef = useRef<any>(null);

    // Animated values
    const animatedStepOpacity = useSharedValue(1);

    // Load sound effect
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
                sound.unloadAsync();
            }
        };
    }, []);

    // Function to toggle step detection
    const toggleDetection = () => {
        if (isDetecting) {
            stopDetection();
        } else {
            startDetection();
        }
    };

    // Start step detection
    const startDetection = async () => {
        setStepCount(0);
        localStepCountRef.current = 0;
        setTempo(0);
        currentTempoRef.current = 0;
        stepTimesRef.current = [];
        setStepTimestamps([]);

        Accelerometer.setUpdateInterval(20); // ~50Hz

        subscriptionRef.current = Accelerometer.addListener(data => {
            processAccelerometerData(data);
        });
    };

    // Stop step detection
    const stopDetection = () => {
        if (subscriptionRef.current) {
            subscriptionRef.current.remove();
            subscriptionRef.current = null;
        }
    };

    useEffect(() => {
        if (autoStart && !subscriptionRef.current) {
            console.log("Starting step detection due to autoStart");
            startDetection();
        }
        else if (!autoStart && subscriptionRef.current) {
            console.log("Stopping step detection due to autoStart becoming false");
            stopDetection();
        }

        return () => {
            if (subscriptionRef.current) {
                console.log("Cleaning up step detection on unmount");
                stopDetection();
            }
        };
    }, [autoStart]);

    // Process accelerometer data for step detection
    const processAccelerometerData = async (data: any) => {
        const { x, y, z } = data;
        const magnitude = Math.sqrt(x * x + y * y + z * z);
        const now = Date.now();

        // Check if we're in an inactive state to avoid false positives
        if (isInInactiveStateRef.current) {
            const inactiveTime = now - lastStepTimeRef.current;
            const minimumStepInterval = tempo > 0 ? (60000 / tempo) * 0.5 : 200;

            if (inactiveTime > minimumStepInterval) {
                isInInactiveStateRef.current = false;
            } else {
                return;
            }
        }

        if (magnitude > threshold) {
            // Animate step indicator
            animatedStepOpacity.value = withTiming(0.2, { duration: 100 }, () => {
                animatedStepOpacity.value = withTiming(1, { duration: 100 });
            });

            // Play sound if loaded
            if (sound) {
                try {
                    await sound.replayAsync();
                } catch (error) {
                    console.warn("Could not play step sound", error);
                }
            }

            // Record timestamp for this step with high precision
            const preciseTimestamp = getCurrentTime();
            const newStepTimestamps = [...stepTimestamps, preciseTimestamp];
            setStepTimestamps(newStepTimestamps);

            // Calculate step intervals and tempo
            if (lastStepTimeRef.current > 0) {
                const interval = now - lastStepTimeRef.current;
                stepTimesRef.current.push(interval);

                // Keep only the last 5 steps for a rolling average
                if (stepTimesRef.current.length > 5) {
                    stepTimesRef.current.shift();
                }

                // Calculate average tempo based on recent steps
                if (stepTimesRef.current.length > 0) {
                    const avgInterval = stepTimesRef.current.reduce((sum, val) => sum + val, 0) / stepTimesRef.current.length;
                    const newTempo = Math.round(60000 / avgInterval);
                    currentTempoRef.current = newTempo;
                    setTempo(newTempo);
                }
            }

            // Increment local step count reference
            localStepCountRef.current += 1;

            // Update global step count
            setStepCount(localStepCountRef.current);

            // Notify parent component if callback provided
            if (onStepDetected) {
                onStepDetected(localStepCountRef.current, currentTempoRef.current, preciseTimestamp);
            }

            // Set inactive state to avoid multiple steps being detected from a single step
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

    // Handling slider UI
    const handleValueChange = (value: number) => {
        setLocalThreshold(value);
    };

    // After sliding is complete, change threshold-value and save to db
    const handleSlidingComplete = (value: number) => {
        if (user) updateUserThreshold(value);
        setThreshold(value);
        setLocalThreshold(value);
    };


    return (
        <View>
            <Animated.View style={[styles.stepIndicator, stepIndicatorStyle]} />

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
        marginTop: 20,
        width: '100%',
        alignItems: 'center'
    },
    slider: {
        width: '80%',
        height: 40
    },
    timestampContainer: {
        marginTop: 10,
        alignItems: 'center'
    }
});

export default StepDetector;