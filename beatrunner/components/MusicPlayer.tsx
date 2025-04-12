import { useMusicContext } from '@/contexts/MusicContext';
import { globalStyles } from '@/styles/globalStyles';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fetchSongs } from '@/firebase/songsService';
import { useTimerContext } from '@/contexts/TimerContext';

interface Song {
    id: string;
    name: string;
    bpm: number;
}

export default function MusicPlayer({ songs }: { songs: string[] }) {

    const [levelSongs, setLevelSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);

    const { setPlayer, audioUri, songPlaying, currentSongId, setCurrentSongId, setSongBpm, setLevelEnd, levelEnd } = useMusicContext();
    const { resetTimer } = useTimerContext();

    const player = useAudioPlayer(audioUri ? audioUri : '', 1000);
    const status = useAudioPlayerStatus(player);

    useEffect(() => {
        const fetchLevelSongs = async () => {
            try {
                const data = await fetchSongs(songs);
                setLevelSongs(data);
            } catch (error) {
                console.error("Error loading songs: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLevelSongs();
    }, [songs]);

    useEffect(() => {
        console.log("Level Songs:", levelSongs);
    }, [levelSongs]);
    
    useEffect(() => {
        console.log("Current Song ID:", currentSongId);
    }, [currentSongId]);

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
            setCurrentSongId(Number(levelSongs[0].id));
            setSongBpm(levelSongs[0].bpm);
        }
    }, [levelSongs]);

    useEffect(() => {
        setPlayer(player);
    }, [audioUri]);


    // checking if song finished
    useEffect(() => {
        if (status?.didJustFinish) {
            handleNextSong();
        }
    }, [status]);


    // handling next song or end of playlist
    const handleNextSong = async () => {
        if (!currentSongId) return;

        console.log(currentSongId);
        const currentIndex = levelSongs.findIndex(song => Number(song.id) === currentSongId);
        const nextIndex = (currentIndex + 1) % levelSongs.length;
        const nextSong = levelSongs[nextIndex];
        await stopMusic();
        setPlayer(null); // if it aint broke, dont fix it. 
        resetTimer();

        if (nextIndex === 0 && !levelEnd) {
            setTimeout(() => {
                setLevelEnd(true);
            }, 300);
        } else {
            setTimeout(() => {
                setCurrentSongId(Number(nextSong.id));
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
