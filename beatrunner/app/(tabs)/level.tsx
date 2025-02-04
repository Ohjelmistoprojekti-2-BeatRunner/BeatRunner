import MusicPlayer from '@/components/MusicPlayer';
import { globalStyles } from '@/styles/globalStyles';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function LevelScreen() {
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Level</Text>
            <MusicPlayer />
        </View >
    )
}