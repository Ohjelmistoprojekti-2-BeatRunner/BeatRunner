import { globalStyles } from "@/styles/globalStyles";
import { Audio } from "expo-av";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type MusicPlayerProps = {
  songname: string;
};

export default function MusicPlayer({songname} : MusicPlayerProps) {

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

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
      const { sound } = await Audio.Sound.createAsync(
        require(`../assets/musics/song.mp3`),
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

