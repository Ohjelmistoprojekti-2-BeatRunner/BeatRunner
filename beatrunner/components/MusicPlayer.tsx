import { useLevelContext } from '@/contexts/LevelContext';
import { useMusicContext } from '@/contexts/MusicContext';
import { globalStyles } from '@/styles/globalStyles';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';


export default function MusicPlayer() {
    const { setPlayer, audioUri, songPlaying, currentSongId, setCurrentSongId, setSongBpm } = useMusicContext();
    const { levelSongs } = useLevelContext();

    const player = useAudioPlayer(audioUri, 1000);
    const status = useAudioPlayerStatus(player);

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

    useEffect(() => {
        if (levelSongs.length > 0) {
            setCurrentSongId(levelSongs[0].id);
            setSongBpm(levelSongs[0].bpm); 
        }
    }, [levelSongs]);

    useEffect(() => {
        setPlayer(player);
    }, [player]);

    const startMusic = async () => {
        if (player) {
            player.play();
        }
    };

    useEffect(() => {
        if (status?.didJustFinish) {
            handleNextSong(); 
        }
    }, [status]);

    const handleNextSong = () => {
        if (!currentSongId) return;

        const currentIndex = currentSongId;
        const nextIndex = (currentIndex + 1) % levelSongs.length; // Loop back to the first song if at the end
        const nextSong = levelSongs[nextIndex];

        setCurrentSongId(nextSong.id);
        setSongBpm(nextSong.bpm);
    };

    const stopMusic = async () => {
        if (player) {
            await player.pause();
            await player.remove();
        }
    };

    useEffect(() => {
        console.log("hgd")
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
                    {songPlaying ? currentSongId : ''}
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
