import { globalStyles } from "@/styles/globalStyles";
import { Audio } from "expo-av";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type MusicPlayerProps = {
    id: string;
};

export default function MusicPlayer({ id }: MusicPlayerProps) {

    const musicFiles: Record<string, any> = {
        "1": require("../assets/musics/song1.mp3"),
        "2": require("../assets/musics/song2.mp3"),
        "3": require("../assets/musics/song1.mp3"),
    };

    console.log(id);

    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);


    //handling multiple similar time loadings and problems with too late syncs. (with chatgpt):
    useEffect(() => {
        let isMounted = true;
        const loadSound = async () => {
            if (isLoading) return; 
            setIsLoading(true);

            if (sound) {
                await sound.unloadAsync();
                setSound(null);
            }

            const source = musicFiles[id];
            if (!source) {
                console.error(`File "${id}" not found`);
                setIsLoading(false);
                return;
            }

            try {
                const { sound: newSound } = await Audio.Sound.createAsync(source);
                if (isMounted) {
                    setSound(newSound);
                }
            } catch (error) {
                console.error(error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadSound();

        return () => {
            isMounted = false;
        };
    }, [id]);

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);


    const playPauseSound = async () => {
        if (sound) {
            const status = (await sound.getStatusAsync());
            if (status.isLoaded) {
                if (isPlaying) {
                    await sound.pauseAsync();
                } else {
                    await sound.playAsync();
                }
                setIsPlaying(!isPlaying);
            }
        } else {
            const source = musicFiles[id];
            if (!source) {
                console.error(`File with id ${id} not found`);
                return;
            }
            const { sound } = await Audio.Sound.createAsync(
                source,
                { shouldPlay: true }
            );
            setSound(sound);
            setIsPlaying(true);
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <TouchableOpacity style={globalStyles.button} onPress={playPauseSound}>
                <Text style={globalStyles.buttonText}>{isPlaying ? "Pause" : "Start running"}</Text>
            </TouchableOpacity>
        </View>
    );
}

