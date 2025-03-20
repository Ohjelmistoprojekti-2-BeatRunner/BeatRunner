import { useMusicContext } from '@/contexts/MusicContext';

export const useMusicCurrentTime = () => {
    const { currentTimeRef } = useMusicContext();
    console.log("currenttimeref useMusicCurrentTime-hookissa: " + currentTimeRef.current);
    return currentTimeRef; 
};