import { useLevelContext } from '@/contexts/LevelContext';
import { useMusicContext } from '@/contexts/MusicContext';
import { globalStyles } from '@/styles/globalStyles';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useScores } from '@/hooks/useScores';


export default function MusicPlayer() {
    const { setPlayer, audioUri, songPlaying, currentSongId, setCurrentSongId, setSongBpm } = useMusicContext();
    const { levelSongs } = useLevelContext();

    const player = useAudioPlayer(audioUri ? audioUri : '', 1000);
    const status = useAudioPlayerStatus(player); 

    const { endLevel } = useScores();

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
    }, [audioUri]);

    const startMusic = async () => {
        if (player) {
            player.play();
        }
    };

    // checking if song finished
    useEffect(() => {
        if (status?.didJustFinish) {
            handleNextSong(); 
        }
    }, [status]);

    // handling next song or end of playlist
    const handleNextSong = async () => {
        if (!currentSongId) return;
    
        const currentIndex = levelSongs.findIndex(song => song.id === currentSongId);
        const nextIndex = (currentIndex + 1) % levelSongs.length; 
        const nextSong = levelSongs[nextIndex];
        await stopMusic(); 
        setPlayer(null); // if it aint broke, dont fix it. 

        if (nextIndex === 0) {
            setTimeout(() => {
                endLevel();  
            }, 300);
        } else {   
            setTimeout(() => {
                setCurrentSongId(nextSong.id);
                setSongBpm(nextSong.bpm);
            }, 300);
        }
    };

    const stopMusic = async () => {
        if (player && player.playing) {
            await player.pause();
        }
    };

    useEffect(() => {
        if (!audioUri || !songPlaying) {
            stopMusic();
        } else {
            console.log("Starting new song:", audioUri);
            player.play(); 
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
