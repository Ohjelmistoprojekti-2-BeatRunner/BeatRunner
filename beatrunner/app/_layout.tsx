import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MusicProvider, useMusicContext } from '@/contexts/MusicContext';
import MusicPlayerNew from '@/components/MusicPlayerNew';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <MusicProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="+not-found" />
                    <Stack.Screen name="level" options={{ headerTitle: "Level" }} />
                </Stack>
                <MusicPlayerIf />
                <StatusBar style="auto" />
            </ThemeProvider>
        </MusicProvider>
    )
};


const MusicPlayerIf = () => {
    const { audioUri } = useMusicContext(); 
   
    if (audioUri) {
        return <MusicPlayerNew />;
    }
    return null; 
}
