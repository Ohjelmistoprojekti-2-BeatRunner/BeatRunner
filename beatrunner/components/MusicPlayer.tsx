import React, { useEffect, useRef } from 'react';
import { setAudioModeAsync } from 'expo-audio';
import { StyleSheet, Text, View } from 'react-native';
import { useMusicContext } from '@/contexts/MusicContext';
import { globalStyles } from '@/styles/globalStyles';
import { useAudioPlayer } from 'expo-audio';

export default function MusicPlayer() {
    const { audioUri, songPlaying, currentSong } = useMusicContext();

    const player = useAudioPlayer(audioUri);

    // Setup audio mode when the component mounts
    useEffect(() => {
        async function setupAudioMode() {
            await setAudioModeAsync({
                allowsRecording: false,
                playsInSilentMode: true,
                shouldPlayInBackground: true,
                shouldRouteThroughEarpiece: true,
            });
        }
        setupAudioMode();
    }, []);

    const startMusic = async () => {
        if (player) {
            player.play();
        }
    };

    const stopMusic = async () => {
        if (player) {
            player.pause();
            player.remove();
        }
    };

    useEffect(() => {
        if (audioUri && songPlaying) {
            startMusic();
        } else {
            stopMusic();
        }
    }, [audioUri, songPlaying]);

    return (
        <View style={globalStyles.contentContainer}>
            <View style={styles.controls}>
                <Text style={globalStyles.buttonText}>
                    {songPlaying ? currentSong : ''}
                </Text>
                <Text style={globalStyles.buttonText}>
                    {songPlaying ? 'Music playing' : 'Paused'}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    songDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    songInfo: {
        marginLeft: 10,
    },
    songTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    controls: {
        paddingHorizontal: 10,
    },
});
