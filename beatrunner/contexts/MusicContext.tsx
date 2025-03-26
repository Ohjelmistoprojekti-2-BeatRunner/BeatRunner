import { AudioPlayer } from 'expo-audio';
import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect, useRef } from 'react';

const musicFiles: Record<string, any> = {
    "1": require("../assets/musics/level1.mp3"),
    "2": require("../assets/musics/level2.mp3"),
    "3": require("../assets/musics/level3.mp3"),
    "4": require("../assets/musics/level4.mp3"),
};

interface MusicContextType {
    player: AudioPlayer | null;
    setPlayer: (player: AudioPlayer) => void;
    currentTimeRef: React.MutableRefObject<number>;
    currentTime: number;
    setCurrentTime: (time: number) => void;
    currentSong: string | null;
    setCurrentSong: (songName: string) => void;
    audioUri: string | null;
    setAudioUri: (uri: string) => void;
    songPlaying: boolean;
    setSongPlaying: (playing: boolean) => void;
    toggleMusic: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [player, setPlayer] = useState<AudioPlayer | null>(null);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [currentSong, setCurrentSong] = useState<string | null>(null);
    const [audioUri, setAudioUri] = useState<string | null>(null)
    const [songPlaying, setSongPlaying] = useState<boolean>(false);

    const currentTimeRef = useRef<number>(0);

    const updateAudioUri = (songName: string) => {
        setAudioUri(musicFiles[songName]);
    };

    const handleSongSelection = (songName: string) => {
        setCurrentSong(songName);
        updateAudioUri(songName);
    };

    useEffect(() => {
        currentTimeRef.current = currentTime;
    }, [currentTime]);

    useEffect(() => {
        if (player && songPlaying) {
            const interval = setInterval(() => {
                setCurrentTime(player.currentTime); 
            }, 100); // Update every 100ms

            return () => clearInterval(interval);
        }
    }, [player, songPlaying]); 

    const toggleMusic = () => {
        setSongPlaying(prevState => !prevState);
    };

    const value = useMemo(() => ({
        player,
        setPlayer,
        currentTimeRef,
        currentTime,
        setCurrentTime,
        currentSong,
        setCurrentSong: handleSongSelection,
        audioUri,
        setAudioUri,
        songPlaying,
        setSongPlaying,
        toggleMusic
    }), [currentSong, audioUri, songPlaying]);

    return (
        <MusicContext.Provider value={value}>
            {children}
        </MusicContext.Provider>
    );
};

export const useMusicContext = (): MusicContextType => {
    const context = useContext(MusicContext);
    if (!context) {
        throw new Error('useMusicContext must be used within a MusicProvider');
    }
    return context;
};