import { useMusicContext } from '@/contexts/MusicContext';
import { useTimerContext } from '@/contexts/TimerContext';
import { fetchSongs } from '@/firebase/songsService';
import { globalStyles } from '@/styles/globalStyles';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, InteractionManager, Text } from 'react-native';

interface Song {
    id: string;
    name: string;
    bpm: number;
}

export default function MusicPlayer({ songs }: { songs: string[] }) {

    const [levelSongs, setLevelSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(Number);

    const { setPlayer, audioUri, songPlaying, currentSongId, setCurrentSongId, setSongBpm, setLevelEnd, levelEnd } = useMusicContext();
    const { time, resetTimer } = useTimerContext();

    const player = useAudioPlayer(audioUri ? audioUri : '', 1000);
    const status = useAudioPlayerStatus(player);
    const animationRef = useRef<LottieView>(null);
    const screenWidth = Dimensions.get('window').width;

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

    // Log the list of level songs for debugging
    useEffect(() => {
        console.log("Level Songs:", levelSongs);
    }, [levelSongs]);

    // Log the current song ID for debugging
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


    // Check if the current song has finished playing
    useEffect(() => {
        if (status?.didJustFinish) {
            handleNextSong();
        }
    }, [status]);


    // Handle transitioning to the next song or ending the playlist
    const handleNextSong = async () => {
        if (!currentSongId) return;

        console.log(currentSongId);
        setCurrentIndex(levelSongs.findIndex(song => Number(song.id) === currentSongId));
        const nextIndex = (currentIndex + 1) % levelSongs.length;
        const nextSong = levelSongs[nextIndex];
        await stopMusic();
        setPlayer(null);
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
            InteractionManager.runAfterInteractions(async () => { // Ensure ExoPlayer methods are called on the main thread to prevent crashes
                player.pause();
            });
        }
    };


    useEffect(() => {
        if (!audioUri || !songPlaying) {
            stopMusic();
            animationRef.current?.reset();
        } else {
            InteractionManager.runAfterInteractions(async () => {
                player.play();
            });
            animationRef.current?.play();
        }
    }, [audioUri, songPlaying]);

    return (
        <>
            <Text style={globalStyles.playerHeader}>
                {songPlaying
                    ? `Playing song ${currentIndex + 1} of ${levelSongs.length}`
                    : `Paused - song ${currentIndex + 1} of ${levelSongs.length}`}
            </Text>
            <Text style={globalStyles.buttonLabel}>Time: {(time / 1000).toFixed(2)} s</Text>
            <LottieView ref={animationRef} source={require('../assets/images/musicanimation.json')} loop autoPlay={false} resizeMode='cover' style={{ width: screenWidth, height: 80, zIndex: 0 }} />
        </>
    );
}
