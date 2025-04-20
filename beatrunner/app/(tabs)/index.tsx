import { useDatabase } from '@/hooks/useDatabase';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, Image, StyleSheet, TextStyle } from 'react-native';

interface Level {
    id: string;
    title: string;
    difficulty: string;
    calories: number;
    songs: [];
}

export default function HomeScreen() {

    const [levels, setLevels] = useState<Level[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { fetchLevels } = useDatabase();

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

    const getColorForDifficulty = (difficulty: string): TextStyle => {
        switch (difficulty) {
            case "easy":
                return { color: '#64b55b'};
            case "moderate":
                return { color: '#e6c353'};
            case "hard":
                return { color: '#de6f80'};
            default:
                return { color: 'white'};
        }
    }


    const Item = ({ id, title, difficulty, calories, songs }: Level) => (
        <View style={{ margin: 10, width: 300 }}>
            <TouchableOpacity style={globalStyles.button} onPress={() => router.replace({
                pathname: "/level",
                params: { id, title, difficulty, calories, songs }
            })}>
                <Text style={globalStyles.buttonText}>{title}</Text>
                <Text style={[getColorForDifficulty(difficulty), globalStyles.difficultyText]}>{difficulty}</Text>
            </TouchableOpacity>
        </View>
    );


    return (
        <View style={globalStyles.container}>
            <View style={globalStyles.topContainer}>
                <Text style={globalStyles.title}>Welcome username!</Text>
                <View style={globalStyles.contentContainer}>
                <Text style={globalStyles.sectionTitle}>Total time run: <Text style={globalStyles.contentText}>45.2 hours</Text></Text>
                <Text style={globalStyles.sectionTitle}>Levels completed: <Text style={globalStyles.contentText}>2</Text></Text>
                </View>
            </View>

            <Image style={{ width: 'auto', height: 100 }} source={require('../../assets/images/rhytm.jpg')} />

            <View style={globalStyles.bottomContainer}>

                <Text style={globalStyles.title}>Levels</Text>
                <FlatList
                    data={levels}
                    renderItem={({ item }) => <Item id={item.id} title={item.title} difficulty={item.difficulty} calories={item.calories} songs={item.songs} />}
                />

            </View>
        </View>
    );
}

export const globalStyles = StyleSheet.create({
    title: {
        color: 'white',
        fontSize: 29,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10
    },
    indexContainer: {
        flex: 1,
        backgroundColor: 'black',
    },
    container: {
        flex: 1,
        backgroundColor: 'black',
        padding: 3,
    },
    topContainer: {
        marginTop: 20,
        margin: 20
    },
    bottomContainer: {
        alignItems: 'center',
        paddingBottom: 50,
    },
    button: {
        paddingVertical: 13,
        paddingHorizontal: 30,
        borderWidth: 2,
        borderColor: 'rgb(97, 40, 112)',
        borderRadius: 15,
        backgroundColor: 'rgb(24, 3, 29)',
        boxShadow: '5px 5px 6px rgb(89, 34, 104)',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    difficultyText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlignVertical: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 23,
    },
    orText: {
        color: 'white',
        fontSize: 24,
        marginVertical: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 8,
        padding: 10,
        color: 'white',
        marginTop: 5,
        width: '70%',
    },
    sectionTitle: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
        marginLeft: 20
    },
    logoutButton: {
        marginTop: 20,
        backgroundColor: '#8b0000', // red color for Logout
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        alignSelf: 'flex-end', // positioned on the right
        width: '30%',
    },
    contentContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: 'rgba(226, 44, 250, 0.18)',
        boxShadow: 'inset 0 1px 20px 3px rgb(0, 0, 0)',
        borderRadius: 15,
    },
    contentText: {
        color: 'white',
        fontSize: 17,
        marginVertical: 5,
        fontWeight: 'normal',
    },
    link: {
        marginTop: 20,
        color: 'lightblue',
        textDecorationLine: 'underline',
    },
});


