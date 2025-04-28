import { musicFiles } from '@/assets/musics/MusicFiles';
import { AudioPlayer } from 'expo-audio';
import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';

interface MusicContextType {
    player: AudioPlayer | null;
    setPlayer: (player: AudioPlayer | null) => void;
    songBpm: number;
    setSongBpm: (time: number) => void;
    levelEnd: boolean;
    setLevelEnd: (levelend: boolean) => void;
    currentSongId: number | null;
    setCurrentSongId: (songId: number) => void;
    audioUri: string | null;
    setAudioUri: (uri: string) => void;
    songPlaying: boolean;
    setSongPlaying: (playing: boolean) => void;
    toggleMusic: () => void;
}

// Music context keeps track of the currently playing music track and music players status and provides that data tho other components
const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [player, setPlayer] = useState<AudioPlayer | null>(null);
    const [songBpm, setSongBpm] = useState<number>(0);
    const [levelEnd, setLevelEnd] = useState<boolean>(false);
    const [currentSongId, setCurrentSongId] = useState<number | null>(null);
    const [audioUri, setAudioUri] = useState<string | null>(null)
    const [songPlaying, setSongPlaying] = useState<boolean>(false);

    const updateAudioUri = (songId: number) => {
        setAudioUri(musicFiles[songId]);
    };

    const handleSongSelection = (songId: number) => {
        setCurrentSongId(songId);
        updateAudioUri(songId);
    };

    const toggleMusic = () => {
        setSongPlaying(prevState => !prevState);
    };

    const value = useMemo(() => ({
        player,
        setPlayer,
        currentSongId,
        setCurrentSongId: handleSongSelection,
        audioUri,
        setAudioUri,
        songBpm,
        setSongBpm,
        levelEnd,
        setLevelEnd,
        songPlaying,
        setSongPlaying,
        toggleMusic
    }), [player, currentSongId, audioUri, songBpm, levelEnd, songPlaying]);
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