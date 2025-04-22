import ProfileScoresModal from '@/components/ProfileScoresModal';
import { useUserContext } from '@/contexts/UserContext';
import { fetchLevels, Level } from '@/firebase/levelsService';
import { formatTimestamp } from '@/scripts/formatTimestamp';
import { router } from 'expo-router';
import { globalStyles as gs } from '@/styles/globalStyles';
import React, { useDebugValue, useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, StyleSheet, Image, TextStyle, ActivityIndicator } from 'react-native';
import { fetchLevelTopResultsWithUsername } from '@/firebase/scoresService';
import { getAuth } from 'firebase/auth';

export default function HomeScreen() {

    const { bestScores, loading: userLoading } = useUserContext();
    const [levels, setLevels] = useState<Level[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { user, userData, loading: authLoading } = useUserContext();

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | undefined>(user?.uid);
    const [selectedLevelId, setSelectedLevelId] = useState<string | undefined>(undefined);
    const [selectedMode, setSelectedMode] = useState<'profile' | 'levelScores'>('profile');

    useEffect(() => {
        if (!user) return;
        const getLevels = async () => {
            try {
                setLoading(true);
                const levelsData = await fetchLevels();
                setLevels(levelsData);
            } catch (error) {
                console.error("Error loading levels: ", error);
            } finally {
                setLoading(false);
            }
        };

        getLevels();
    }, [user]);

    const getColorForDifficulty = (difficulty: string): TextStyle => {
        switch (difficulty) {
            case "easy":
                return { color: '#64b55b' };
            case "moderate":
                return { color: '#e6c353' };
            case "hard":
                return { color: '#de6f80' };
            default:
                return { color: 'white' };
        }
    }

    const handleProfileModal = async () => {
        setSelectedLevelId(undefined);
        setSelectedUserId(user?.uid);
        setSelectedMode('profile');
        setModalVisible(true);
    };


    const Item = ({ id, title, difficulty, calories, songs }: Level) => {

        const levelCompleted = !!bestScores[id];
        return (
            <View style={{ margin: 10, width: 300 }}>
                <TouchableOpacity style={levelCompleted ? styles.levelButtonCompleted : styles.levelButton} onPress={() => router.replace({
                    pathname: "/level",
                    params: { id, title, difficulty, calories, songs, }
                })}>
                    <View>
                        <Text style={[styles.buttonText, { color: 'white' }]}>{title}</Text>
                        <Text style={[getColorForDifficulty(difficulty), styles.difficultyText]}>{difficulty}</Text>
                    </View>
                    <View>
                        {bestScores[id] ?
                            <Text style={[getColorForDifficulty('default'), styles.buttonText, { textAlign: 'right' }]}>{bestScores[id].score}</Text>
                            : <Text style={[getColorForDifficulty('default'), styles.difficultyText]}>Not yet played</Text>
                        }
                        {bestScores[id] ?
                            <Text style={[getColorForDifficulty('default'), styles.difficultyText]}>{formatTimestamp(bestScores[id].timestamp)}</Text>
                            : ""
                        }
                    </View>
                </TouchableOpacity>
            </View>
        )
    };


    return (
        <View style={[styles.container, { flex: 1 }]}>

            <View style={styles.topContainer}>
                <Text style={styles.title}>Welcome {userData?.username}</Text>
                <TouchableOpacity onPress={handleProfileModal}>
                    <View style={gs.statContentContainer}>
                        <View style={gs.statContentRow}>
                            <Text style={gs.statRowTitle}>Total score: </Text>
                            <Text style={[gs.statRowText]}>{userData?.totalScore}</Text>
                        </View>
                        <View style={gs.statContentRow}>
                            <Text style={gs.statRowTitle}>Levels completed:
                            </Text>
                            <Text style={[gs.statRowText]}>{Object.keys(bestScores).length}</Text>
                        </View>

                    </View>
                </TouchableOpacity>
            </View>

            <Image style={{ width: 'auto', height: 100 }} source={require('../../assets/images/rhytm.jpg')} />
            {loading && (
                <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
            )}
            {!loading && (
                <View style={[styles.bottomContainer, { flex: 1 }]}>


                    <FlatList
                        data={levels}
                        renderItem={({ item }) => <Item id={item.id} levelOrder={item.levelOrder} title={item.title} difficulty={item.difficulty} calories={item.calories} songs={item.songs} />}

                        ListHeaderComponent={() => (
                            <Text style={styles.title}>Levels</Text>
                        )}
                    />
                </View>
            )}

            {modalVisible && (
                <ProfileScoresModal
                    visible={modalVisible}
                    userId={selectedUserId}
                    levelId={selectedLevelId}
                    onClose={() => setModalVisible(false)}
                    mode={selectedMode}
                />
            )}
        </View>
    );
}

export const styles = StyleSheet.create({
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
    levelButton: {
        paddingVertical: 13,
        paddingHorizontal: 20,
        borderWidth: 2,
        borderColor: 'rgb(97, 40, 112)',
        borderRadius: 15,
        backgroundColor: 'rgb(24, 3, 29)',
        boxShadow: '5px 5px 6px rgb(89, 34, 104)',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    levelButtonCompleted: {
        paddingVertical: 13,
        paddingHorizontal: 20,
        borderWidth: 2,
        borderColor: 'rgb(97, 112, 40)',
        borderRadius: 15,
        backgroundColor: 'rgb(24, 3, 29)',
        boxShadow: '5px 5px 6px rgb(89, 104, 34)',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    difficultyText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlignVertical: 'center',
    },
    buttonText: {
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
        marginLeft: 30
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
    link: {
        marginTop: 20,
        color: 'lightblue',
        textDecorationLine: 'underline',
    },
});


