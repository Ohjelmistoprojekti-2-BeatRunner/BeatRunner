import { useMusicContext } from '@/contexts/MusicContext';
import { globalStyles } from '@/styles/globalStyles';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';


//former musicplayerNew.

export default function MusicPlayer() {
    const { audioUri, songPlaying, currentSong } = useMusicContext();
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

    const startMusic = async () => {
        player.play();
    };

    const stopMusic = () => {
        player.pause();
        player.remove();
    };

    useEffect(() => {
        if (songPlaying) {
            startMusic()
        } else {
            stopMusic()
        }
    }, [songPlaying]);

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
