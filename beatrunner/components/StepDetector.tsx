import { useMusicContext } from '@/contexts/MusicContext';
import { useStepDetector } from '@/contexts/StepDetectorContext';
import { useMusicCurrentTime } from '@/hooks/useMusicCurrentTime';
import { globalStyles } from '@/styles/globalStyles';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { Accelerometer } from 'expo-sensors';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface StepDetectorProps {
    onStepDetected?: (stepCount: number, tempo: number) => void;
}

const StepDetector: React.FC<StepDetectorProps> = ({ onStepDetected }) => {
    // StepDetectorContext variables
    const { isDetecting, threshold, setThreshold } = useStepDetector();
    // State variables 

    const [stepCount, setStepCount] = useState(0);
    const [tempo, setTempo] = useState(0);
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    // References for step detection
    const accelerationRef = useRef({ x: 0, y: 0, z: 0 });
    const lastStepTimeRef = useRef<number>(0);
    const stepTimesRef = useRef<number[]>([]);
    const isInInactiveStateRef = useRef(false);
    const subscriptionRef = useRef<any>(null);

    // Animated values
    const animatedStepOpacity = useSharedValue(1);

    const currentTime = useMusicCurrentTime().current;

    // Load sound effect
    useEffect(() => {
        async function loadSound() {
            try {
                const { sound } = await Audio.Sound.createAsync(
                    require('../assets/sounds/step.mp3'),
                    { shouldPlay: false }
                );
                setSound(sound);
            } catch (error) {
                console.error("Failed to load sound", error);
            }
        }

        loadSound();

        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, []);

    useEffect(() => {
        if (isDetecting) {
            startDetection();
        } else {
            stopDetection();
        }
    }, [isDetecting]);

    // Start detection
    const startDetection = async () => {
        // Reset values
        setStepCount(0);
        setTempo(0);
        stepTimesRef.current = [];
        lastStepTimeRef.current = 0;

        // Set accelerometer update interval (faster updates)
        Accelerometer.setUpdateInterval(20); // ~50Hz (20ms)

        // Subscribe to accelerometer updates
        subscriptionRef.current = Accelerometer.addListener(data => {
            accelerationRef.current = data;
            processAccelerometerData(data);
        });
    };

    // Stop detection
    const stopDetection = () => {
        if (subscriptionRef.current) {
            subscriptionRef.current.remove();
        }
    };

    // Process accelerometer data to detect steps
    const processAccelerometerData = (data: { x: number, y: number, z: number }) => {
        // Calculate magnitude of acceleration vector
        const magnitude = Math.sqrt(data.x * data.x + data.y * data.y + data.z * data.z);

        // Get current time
        const now = Date.now();

        // Check if we're in the inactive state after a step
        if (isInInactiveStateRef.current) {
            // Calculate appropriate inactive time based on current tempo
            const inactiveTime = tempo > 0 ? (60000 / tempo) * 0.5 : 500;

            // If enough time has passed, exit inactive state
            if (now - lastStepTimeRef.current > inactiveTime) {
                isInInactiveStateRef.current = false;
            }
            return;
        }

        // Check if magnitude exceeds threshold (step detected)
        if (magnitude > threshold) {
            // Flash the step indicator
            animatedStepOpacity.value = 0;
            animatedStepOpacity.value = withTiming(1, { duration: 300 });

            // Play sound for feedback
            if (sound) {
                sound.replayAsync();
            }

            // Record step time and calculate intervals
            const stepTime = now;
            if (lastStepTimeRef.current > 0) {
                const interval = stepTime - lastStepTimeRef.current;

                // Only consider reasonable intervals (200ms to 2000ms)
                if (interval > 200 && interval < 2000) {
                    stepTimesRef.current.push(interval);

                    // Keep only the last 5 steps for tempo calculation
                    if (stepTimesRef.current.length > 5) {
                        stepTimesRef.current.shift();
                    }

                    // Calculate tempo in steps per minute
                    if (stepTimesRef.current.length > 1) {
                        const avgInterval = stepTimesRef.current.reduce((sum, val) => sum + val, 0) / stepTimesRef.current.length;
                        const calculatedTempo = Math.round(60000 / avgInterval);
                        setTempo(calculatedTempo);
                    }
                }
            }

            lastStepTimeRef.current = stepTime;

            // Update step count
            setStepCount((prevCount: number) => { 
                const newCount = prevCount + 1;
                if (onStepDetected) {
                    onStepDetected(newCount, tempo);
                }
                console.log("currentime, stepdetectorissa: " + currentTime)
                return newCount;
            });

            // Enter inactive state to prevent false positives
            isInInactiveStateRef.current = true;
        }
    };

    // Animated style for step indicator
    const stepIndicatorStyle = useAnimatedStyle(() => {
        return {
            opacity: animatedStepOpacity.value,
        };
    });

    return (
        <View >
            <Animated.View style={[styles.stepIndicator, stepIndicatorStyle]} />

            <Text style={globalStyles.contentText}>Step Count: {stepCount}</Text>
            <Text style={globalStyles.contentText}>Tempo: {tempo} SPM</Text>

            <View style={styles.controlsContainer}>
                <Text style={globalStyles.contentText}>Sensitivity: {threshold.toFixed(2)}</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0.5}
                    maximumValue={2.0}
                    step={0.1}
                    value={threshold}
                    onValueChange={setThreshold}
                    minimumTrackTintColor="#4CAF50"
                    maximumTrackTintColor="#000000"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
    },
    stepIndicator: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#4CAF50',
        marginBottom: 20,
    },
    controlsContainer: {
        width: '100%',
        marginVertical: 20,
    },
    slider: {
        width: '100%',
        height: 40,
    },
});

export default StepDetector;
