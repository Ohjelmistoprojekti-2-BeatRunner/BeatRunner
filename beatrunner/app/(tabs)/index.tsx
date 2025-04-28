import ProfileScoresModal from '@/components/ProfileScoresModal';
import { useUserContext } from '@/contexts/UserContext';
import { fetchLevels, Level } from '@/firebase/levelsService';
import { formatTimestamp } from '@/scripts/formatTimestamp';
import { globalStyles as gs } from '@/styles/globalStyles';
import { indexStyles } from '@/styles/indexStyles';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TextStyle, TouchableOpacity, View } from 'react-native';

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
        switch (difficulty.split(" ")[0]) {
            case "Easy":
                return { color: '#64b55b' };
            case "Medium":
                return { color: '#e6c353' };
            case "Hard":
                return { color: '#de6f80' };
            case "Impossible":
                return { color: '#ab1dab' }
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

    //gets levels from levels and sets color for difficulty
    const Item = ({ id, title, difficulty, calories, songs }: Level) => {

        const levelCompleted = !!bestScores[id];
        return (
            <View style={{ margin: 10, width: 300 }}>
                <TouchableOpacity style={levelCompleted ? indexStyles.levelButtonCompleted : indexStyles.levelButton} onPress={() => router.replace({
                    pathname: "/level",
                    params: { id, title, difficulty, calories, songs, }
                })}>
                    <View>
                        <Text style={[indexStyles.buttonText, { color: 'white' }]}>{title}</Text>
                        <Text style={[getColorForDifficulty(difficulty), indexStyles.difficultyText]}>{difficulty}</Text>
                    </View>
                    <View>
                        {bestScores[id] ?
                            <Text style={[getColorForDifficulty('default'), indexStyles.buttonText, { textAlign: 'right' }]}>{bestScores[id].score}</Text>
                            : <Text style={[getColorForDifficulty('default'), indexStyles.difficultyText]}>Not yet played</Text>
                        }
                        {bestScores[id] ?
                            <Text style={[getColorForDifficulty('default'), indexStyles.difficultyText]}>{formatTimestamp(bestScores[id].timestamp)}</Text>
                            : ""
                        }
                    </View>
                </TouchableOpacity>
            </View>
        )
    };


    return (
        <View style={[indexStyles.container, { flex: 1 }]}>

            <View style={indexStyles.topContainer}>
                <Text style={indexStyles.title}>Welcome {userData?.username}</Text>
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
                <View style={[indexStyles.bottomContainer, { flex: 1 }]}>


                    <FlatList
                        data={levels}
                        renderItem={({ item }) => <Item id={item.id} levelOrder={item.levelOrder} title={item.title} difficulty={item.difficulty} calories={item.calories} songs={item.songs} />}

                        ListHeaderComponent={() => (
                            <Text style={indexStyles.title}>Levels</Text>
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
