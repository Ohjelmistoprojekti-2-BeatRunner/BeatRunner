import React, { useState } from "react";
import { View, Button, Text } from "react-native";
import { Audio, AVPlaybackStatus } from "expo-av";

export default function MusicPlayer() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const playPauseSound = async () => {
    if (sound) {
      const status = (await sound.getStatusAsync()) as AVPlaybackStatus;
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
        require("../assets/musics/song.mp3"), 
        { shouldPlay: true }
      );
      setSound(sound);
      setIsPlaying(true);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title={isPlaying ? "Pause" : "Play"} onPress={playPauseSound} />
    </View>
  );
}
