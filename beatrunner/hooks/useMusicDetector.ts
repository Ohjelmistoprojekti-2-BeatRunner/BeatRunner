import { useMusicContext } from '@/contexts/MusicContext';
import { useStepDetectorContext } from '@/contexts/StepDetectorContext';

export const useMusicDetector = () => {
    const { setSongPlaying } = useMusicContext();
    const { setIsDetecting } = useStepDetectorContext();

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