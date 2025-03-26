import { useRouter } from 'expo-router';
import { Alert, Button } from 'react-native';

const CustomBackButton = () => {
    const router = useRouter();

    const askBeforeExit = () => {
        Alert.alert(
            "Are you sure?",
            "You are currently playing music and tracking steps. Do you want to stop and exit?",
            [
                { text: "Stay", onPress: () => null }, // Pysy sivulla
                { text: "Exit", onPress: () => router.back() } // Palaa takaisin
            ]
        );
    };

    return <Button title="Back" onPress={askBeforeExit} />;
};