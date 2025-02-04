import { globalStyles } from '@/styles/globalStyles';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {


    return (
        <View style={globalStyles.container}>
            <View style={globalStyles.topContainer}>
                <Text style={globalStyles.title}>Welcome!</Text>
            </View>
            <View style={globalStyles.bottomContainer}>
                <TouchableOpacity style={globalStyles.button} onPress={() => router.push("/(tabs)/level")}>
                    <Text style={globalStyles.buttonText}>Choose Level</Text>
                </TouchableOpacity>
                <Text style={globalStyles.orText}>OR</Text>
                <TouchableOpacity style={globalStyles.button} onPress={() => { /* TODO: Add functionality */ }}>
                    <Text style={globalStyles.buttonText}>Custom Level</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}


