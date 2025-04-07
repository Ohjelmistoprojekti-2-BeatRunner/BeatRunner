import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Song {
    id: number;
    name: string;
    bpm: number;
}

interface LevelContextType {
    levelSongs: Song[];  
    currentLevel: number;  
    setLevel: (level: number) => void; 
}

const LevelContext = createContext<LevelContextType | undefined>(undefined);

export const LevelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentLevel, setCurrentLevel] = useState<number>(1);
    const [levelSongs, setLevelSongs] = useState<Song[]>([
        { id: 1, name: "Song One", bpm: 147 },
        { id: 2, name: "Song Two", bpm: 150 },
        { id: 3, name: "Song Three", bpm: 155 },
    ]);

    return (
        <LevelContext.Provider value={{ levelSongs, currentLevel, setLevel: setCurrentLevel }}>
            {children}
        </LevelContext.Provider>
    );
};

export const useLevelContext = (): LevelContextType => {
    const context = useContext(LevelContext);
    if (!context) {
        throw new Error("useLevelContext must be used within a LevelProvider");
    }
    return context;
};