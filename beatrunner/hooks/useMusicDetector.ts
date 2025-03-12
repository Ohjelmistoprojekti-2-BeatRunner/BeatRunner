import { useMusicContext } from '@/contexts/MusicContext';
import { useStepDetector } from '@/contexts/StepDetectorContext';
import { useState } from 'react';

export const useMusicDetector = () => {
    const { setSongPlaying } = useMusicContext();
    const { setIsDetecting } = useStepDetector();
    const [timer, setTimer] = useState<number>(0);

    const startMusicDetector = () => {
        setSongPlaying(true);
        setIsDetecting(true);
        setTimer(Date.now());
        console.log("Both started");
    };

    const stopMusicDetector = () => {
        setSongPlaying(false);
        setIsDetecting(false);
        setTimer(0);
        console.log("Both stopped");
    };

    return { startMusicDetector, stopMusicDetector, timer, setTimer };
};