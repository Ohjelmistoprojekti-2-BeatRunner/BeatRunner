import React, { createContext, useContext, useMemo, useState } from 'react';

interface StepDetectorContextType {
    isDetecting: boolean;
    stepCount: number;
    tempo: number;
    threshold: number;
    setIsDetecting: (value: boolean) => void;
    setStepCount: (value: number) => void;
    setTempo: (value: number) => void;
    setThreshold: (value: number) => void;
    toggleDetection: () => void;
}

const StepDetectorContext = createContext<StepDetectorContextType | undefined>(undefined);

export const StepDetectorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDetecting, setIsDetecting] = useState(false);
    const [stepCount, setStepCount] = useState(0);
    const [tempo, setTempo] = useState(0);
    const [threshold, setThreshold] = useState(1.2);

    const toggleDetection = () => {
        setIsDetecting(prevState => !prevState);
    };

    const value = useMemo(() => ({
        isDetecting,
        setIsDetecting,
        stepCount,
        setStepCount,
        tempo,
        setTempo,
        threshold,
        setThreshold,
        toggleDetection
    }), [isDetecting, stepCount, tempo, threshold]);

    return (
        <StepDetectorContext.Provider value={value}>
            {children}
        </StepDetectorContext.Provider>
    );
};

export const useStepDetector = () => {
    const context = useContext(StepDetectorContext);
    if (!context) {
        throw new Error('useStepDetector must be used within a StepDetectorProvider');
    }
    return context;
};