import { globalStyles } from '@/styles/globalStyles';
import React from 'react';
import { Text, View } from 'react-native';

export default function AboutScreen() {
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>About</Text>
            <Text style={globalStyles.sectionTitle}>Contact & Licenses</Text>
            <View style={globalStyles.contentContainer}>
                <Text style={globalStyles.contentText}>
                    Information regarding contact, copyrights,
                    and licenses...
                </Text>
            </View>
        </View>
    );
}
