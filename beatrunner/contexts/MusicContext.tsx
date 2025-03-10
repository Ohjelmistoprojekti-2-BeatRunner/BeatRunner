import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

const musicFiles: Record<string, any> = {
    "1": require("../assets/musics/level1.mp3"),
    "2": require("../assets/musics/level2.mp3"),
    "3": require("../assets/musics/level3.mp3"),
    "4": require("../assets/musics/level4.mp3"),
};

interface MusicContextType {
    currentSong: string | null;
    setCurrentSong: (songName: string) => void;
    audioUri: string | null;
    setAudioUri: (uri: string) => void;
    songPlaying: boolean;
    setSongPlaying: (playing: boolean) => void;
    toggleMusicPlayPause: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentSong, setCurrentSong] = useState<string | null>(null);
    const [audioUri, setAudioUri] = useState<string | null>(null)
    const [songPlaying, setSongPlaying] = useState<boolean>(false);

    const updateAudioUri = (songName: string) => {
        setAudioUri(musicFiles[songName]);
    };

    const handleSongSelection = (songName: string) => {
        setCurrentSong(songName);
        updateAudioUri(songName);
    };

    const toggleMusicPlayPause = () => {
        setSongPlaying(prevState => !prevState);
    };

    const value = useMemo(() => ({
        currentSong,
        setCurrentSong: handleSongSelection,
        audioUri,
        setAudioUri,
        songPlaying,
        setSongPlaying,
        toggleMusicPlayPause
    }), [currentSong, audioUri, songPlaying]);

    console.log("audiouri", audioUri);
    console.log("song", currentSong)
    console.log("songplaying", songPlaying);

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