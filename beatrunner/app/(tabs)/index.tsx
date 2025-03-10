import fetchLevels from '@/getLevelsData';
import { globalStyles } from '@/styles/globalStyles';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

interface Level {
    id: string;
    title: string;
    bpm: number;
    difficulty: string;
    calories: number; 
}

export default function HomeScreen() {

    const [levels, setLevels] = useState<Level[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getLevels = async () => {
            try {
                const data = await fetchLevels();
                setLevels(data);
            } catch (error) {
                console.error("Error loading levels: ", error);
            } finally {
                setLoading(false);
            }
        };

        getLevels();
    }, []);


    const Item = ({ id, title, bpm, difficulty, calories }: Level) => (
        <View style={{ margin: 10, width: 300 }}>
            <TouchableOpacity style={globalStyles.button} onPress={() => router.navigate({  //if not in (tabs), need to be navigate instead of push
                pathname: "/level",
                params: { id, title, bpm, difficulty, calories }
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
                    renderItem={({ item }) => <Item id={item.id} title={item.title} bpm={item.bpm} difficulty={item.difficulty} calories={item.calories} />}
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


