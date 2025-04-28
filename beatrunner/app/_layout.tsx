import { MusicProvider } from '@/contexts/MusicContext';
import { StepDetectorProvider } from '@/contexts/StepDetectorContext';
import { TimerProvider } from '@/contexts/TimerContext';
import { UserProvider } from '@/contexts/UserContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });


    const router = useRouter();

    //check if user is logged in and redirect to login page if not
    useEffect(() => {
        let loggedIn = false
        const checkLoginStatus = async () => {
            let keys: readonly string[] = []

            try {
                keys = await AsyncStorage.getAllKeys()
            } catch (e) {
                console.log(e + " error with keys");
            }

            if (keys.length > 0) {
                try {
                    const userToken = await AsyncStorage.getItem(keys[0]);

                    if (userToken === "null") {
                        loggedIn = false;
                    } else if (userToken?.includes("uid")) {
                        loggedIn = true;
                    } else {
                        loggedIn = false;
                    }
                } catch (error) {
                    console.log("Error checking login status", error);
                    loggedIn = false;
                }
            } else {
                loggedIn = false; // Jos avaimia ei ole
            }

            if (loaded && loggedIn === false) {
                router.push("/login");
            }
        };

        if (loaded) {
            SplashScreen.hideAsync();
            checkLoginStatus();


        }
    }, [loaded]);



    if (!loaded) {
        return null;
    }

    return (

        <UserProvider>
            <MusicProvider>
                <TimerProvider>
                    <StepDetectorProvider>
                        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                            <Stack>
                                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                                <Stack.Screen name="+not-found" />
                                <Stack.Screen name="level" options={{
                                    headerTitle: "Level"
                                }} />
                                <Stack.Screen name="login" options={{
                                    headerTitle: "Login",
                                    headerBackVisible: false,
                                }} />
                                <Stack.Screen name="register" options={{
                                    headerTitle: "Register",
                                    headerBackVisible: false,
                                }} />
                            </Stack>
                            <StatusBar style="auto" />
                        </ThemeProvider>
                    </StepDetectorProvider>
                </TimerProvider>
            </MusicProvider>
        </UserProvider>

    )
};


