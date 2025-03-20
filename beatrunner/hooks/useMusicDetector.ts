import { useMusicContext } from '@/contexts/MusicContext';
import { useStepDetector } from '@/contexts/StepDetectorContext';

export const useMusicDetector = () => {
    const { setSongPlaying } = useMusicContext();
    const { setIsDetecting } = useStepDetector();

    const startMusicDetector = () => {
        setSongPlaying(true);
        setIsDetecting(true);
        console.log("Both started");
    };

    const stopMusicDetector = () => {
        setSongPlaying(false);
        setIsDetecting(false);
        console.log("Both stopped");
    };

    return { startMusicDetector, stopMusicDetector};
};