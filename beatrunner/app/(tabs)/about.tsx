import { aboutStyles } from '@/styles/aboutStyles';
import React from 'react';
import { Image, Linking, Text, View } from 'react-native';

export default function AboutScreen() {
    return (
        <View style={aboutStyles.container}>

            <Image style={{ width: 150, height: 150, alignSelf: 'center' }} source={require('../../assets/images/brlogo.png')} />
            <Text style={aboutStyles.sectionTitle}>What is BeatRunner?</Text>
            <View style={aboutStyles.contentContainer}>
                <Text style={aboutStyles.contentText}>
                    BeatRunner is a project developed for the "Software Project 2" course at Haaga-Helia University of Applied Sciences. Our goal was to create an app that makes exercising more enjoyable and motivates people to spend time outdoors.
                </Text>
            </View>

            <Text style={aboutStyles.sectionTitle}>Contact & Licenses</Text>
            <View style={aboutStyles.contentContainer}>
                <Text style={aboutStyles.contentText}>
                    This application is licensed with AGPL-3.0. Images used in the app are royalty-free and properly attributed when required. Built with open-source tools and libraries. See the full list of dependencies in the source code.
                </Text>
                <Text style={aboutStyles.contentText}>
                    For feedback or questions, feel free to contact us at our{" "}
                    <Text
                        style={{ color: 'lightblue', textDecorationLine: 'underline' }}
                        onPress={() => Linking.openURL('https://github.com/Ohjelmistoprojekti-2-BeatRunner')}
                    >
                        GitHub organization
                    </Text>
                    .
                </Text>
                <Text style={aboutStyles.contentText}>
                    Source code is available on{" "}
                    <Text
                        style={aboutStyles.link}
                        onPress={() => Linking.openURL('https://github.com/Ohjelmistoprojekti-2-BeatRunner/BeatRunner')}
                    >
                        GitHub
                    </Text>
                    .
                </Text>
            </View>
        </View>
    );
}