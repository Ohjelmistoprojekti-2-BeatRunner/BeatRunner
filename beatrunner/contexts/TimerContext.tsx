import React, { createContext, useContext, useState, useRef, ReactNode, useMemo } from 'react';

type TimerContextType = {
    time: number;
    startTimer: () => void;
    pauseTimer: () => void;
    resetTimer: () => void;
};

const TimerContext = createContext<TimerContextType>({
    time: 0,
    startTimer: () => {},
    pauseTimer: () => {},
    resetTimer: () => {},
});

type TimerProviderProps = {
    children: ReactNode;
};

export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
    const [time, setTime] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const elapsedTimeRef = useRef<number>(0); 

    const startTimer = () => {
        if (!startTimeRef.current) {
            startTimeRef.current = Date.now() - elapsedTimeRef.current; 
        }

        intervalRef.current = setInterval(() => {
            setTime(Date.now() - startTimeRef.current!); 
        }, 10);
    };

    const pauseTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (startTimeRef.current) {
            elapsedTimeRef.current = Date.now() - startTimeRef.current; 
            startTimeRef.current = null; 
        }
    };

    const resetTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setTime(0);
        startTimeRef.current = null;
        elapsedTimeRef.current = 0;
    };

    const contextValue = useMemo(() => ({
        time,
        startTimer,
        pauseTimer,
        resetTimer,
    }), [time]);

    return (
        <TimerContext.Provider value={contextValue}>
            {children}
        </TimerContext.Provider>
    );
};

export const useTimerContext = () => {
    const context = useContext(TimerContext);
    if (!context) {
        throw new Error("useTimerContext must be used within a TimerProvider");
    }
    return context;
};