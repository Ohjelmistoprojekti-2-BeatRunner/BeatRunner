import { globalStyles } from '@/styles/globalStyles';
import React from 'react';
import { Text, View } from 'react-native';

export default function HelpScreen() {
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Help</Text>
            <Text style={globalStyles.sectionTitle}>Common Issues</Text>
            <View style={globalStyles.contentContainer}>
                <Text style={globalStyles.contentText}>Here you can find solutions to common problems...</Text>
            </View>
        </View>
    );
}