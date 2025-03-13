import { useMusicContext } from '@/contexts/MusicContext';

export const useMusicCurrentTime = () => {
    const { currentTimeRef } = useMusicContext();
    console.log("currenttimeref usimusiccurrenttime-hookissa: " + currentTimeRef.current);
    return currentTimeRef; 
};