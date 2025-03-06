import { globalStyles } from '@/styles/globalStyles';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {

    const levels = [
        {
            title: 'Level 1',
            difficulty: 'easy',
            calories: 200,
            song: '1'
        },
        {
            title: 'Level 2',
            difficulty: 'moderate',
            calories: 300,
            song: '2'
        },
        {
            title: 'Level 3',
            difficulty: 'hard',
            calories: 400,
            song: '3'
        },
        {
            title: 'Level 4',
            difficulty: 'hard',
            calories: 400,
            song: '4'
        }
    ];

    type ItemProps = { title: string; difficulty: string, calories: number, song: string };


    const Item = ({ title, difficulty, calories, song }: ItemProps) => (
        <View style={{ margin: 10, width: 300 }}>
            <TouchableOpacity style={globalStyles.button} onPress={() => router.navigate({  //if not in (tabs), need to be navigate instead of push
                pathname: "/level",
                params: { title, difficulty, calories, song }
            })}>
                <Text style={globalStyles.buttonText}>{title}</Text>
            </TouchableOpacity>
        </View>
    );


    return (
        <View style={globalStyles.container}>
            <View style={globalStyles.topContainer}>
                <Text style={globalStyles.title}>Welcome!</Text>
            </View>
            <View style={globalStyles.bottomContainer}>

                <Text style={globalStyles.orText}>Choose level</Text>
                <FlatList
                    data={levels}
                    renderItem={({ item }) => <Item title={item.title} difficulty={item.difficulty} calories={item.calories} song={item.song} />}
                />

                <Text style={globalStyles.orText}>Custom level</Text>
                <View style={{ margin: 10, width: 300 }}>
                    <TouchableOpacity style={globalStyles.button} onPress={() => { /* TODO: Add functionality */ }}>
                        <Text style={globalStyles.buttonText}>Pick a song</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}


