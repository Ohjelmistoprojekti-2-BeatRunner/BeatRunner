import { useMusicContext } from '@/contexts/MusicContext';
import { globalStyles } from '@/styles/globalStyles';
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';

export default function MusicPlayer() {
    const { audioUri, songPlaying, currentSong, setSongPlaying, toggleMusicPlayPause } = useMusicContext();
    const player = useAudioPlayer(audioUri);

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


    useEffect(() => {
        if (songPlaying) {
            player.play();
        } else {
            player.pause();
        }
    }, [songPlaying]);

    return (
        <View style={styles.bottomPanel}>
            <View style={styles.songDetails}>
                <View style={styles.songInfo}>
                    <Text style={styles.songTitle}>{currentSong || 'No song playing'}</Text>
                </View>
            </View>
            <View style={styles.controls}>

                <Text style={globalStyles.buttonText}>
                    {songPlaying ? 'Paused' : 'Music playing'}
                </Text>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomPanel: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#333',
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
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
