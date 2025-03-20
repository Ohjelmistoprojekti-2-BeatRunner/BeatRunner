import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MusicProvider, useMusicContext } from '@/contexts/MusicContext';
import MusicPlayerNew from '@/components/MusicPlayerNew';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        console.log("Error checking login status", error);
        setLoggedIn(false);
      }
    };

    if (loaded) {
      SplashScreen.hideAsync();
      checkLoginStatus();
    }
  }, [loaded]);

  useEffect(() => {
    if (loaded && !loggedIn) {
      router.replace('/login');
    }
  }, [loggedIn, loaded, router]);

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
          <Stack.Screen name="login" options={{ headerTitle: "Login" }} />
          <Stack.Screen name="register" options={{ headerTitle: "Register" }} />
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
