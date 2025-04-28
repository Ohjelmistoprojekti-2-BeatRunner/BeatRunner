import { useMusicContext } from '@/contexts/MusicContext';
import { useStepDetectorContext } from '@/contexts/StepDetectorContext';

export const useMusicDetector = () => {
    const { setSongPlaying } = useMusicContext();
    const { setIsDetecting } = useStepDetectorContext();

    const startMusicDetector = () => {
        setSongPlaying(true);
        setIsDetecting(true);
        console.log("Music player and step detector started");
    };

    const stopMusicDetector = () => {
        setSongPlaying(false);
        setIsDetecting(false);
        console.log("Music player and step detector stopped");
    };

    return { startMusicDetector, stopMusicDetector};
};