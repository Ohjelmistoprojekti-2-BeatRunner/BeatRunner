import ProfileScoresModal from '@/components/ProfileScoresModal';
import { useUserContext } from '@/contexts/UserContext';
import { fetchLevels, Level } from '@/firebase/levelsService';
import { fetchUserIdByName, fetchUsersOrderByTotalRuns, fetchUsersOrderByTotalScore, UserProfile } from '@/firebase/usersService';
import { globalStyles } from '@/styles/globalStyles';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';

interface UserResults {
    levelId: number;
    userId: string;
    score: number;
    timestamp: number;
}

type PickerLevel = {
    label: string;
    value: string;
};


export default function ScoreScreen() {

    const [totalScoreUsers, setTotalScoreUsers] = useState<UserProfile[]>([]);
    const [totalRunsUsers, setTotalRunsUsers] = useState<UserProfile[]>([]);
    const [statCategory, setStatCategory] = useState<"totalScore" | "totalRuns">("totalScore");
    const [levels, setLevels] = useState<Level[]>([])
    const [allUsers, setAllUsers] = useState<UserProfile[]>([])

    const [searchTerm, setSearchTerm] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);
    const [selectedLevelId, setSelectedLevelId] = useState<string | undefined>(undefined);
    const [selectedMode, setSelectedMode] = useState<'profile' | 'levelScores'>('profile');

    const [isLevelPickerOpen, setIsLevelPickerOpen] = useState(false);
    const [levelPickerValue, setLevelPickerValue] = useState(null);
    const [pickerLevelOptions, setPickerLevelOptions] = useState<PickerLevel[]>([]);;

    const { user, userData, loading } = useUserContext();

    const dataToRender = statCategory === "totalScore" ? totalScoreUsers : totalRunsUsers;

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const levelData = await fetchLevels();
        const topTotalScoreUsers = await fetchUsersOrderByTotalScore();
        const topTotalRunsUsers = await fetchUsersOrderByTotalRuns();
        setTotalScoreUsers(topTotalScoreUsers);
        setTotalRunsUsers(topTotalRunsUsers);
        setLevels(levelData);
        const pickerItems = levelData.map((item) => ({
            label: item.title,
            value: item.id
        }));
        setPickerLevelOptions(pickerItems);
    }


    const handleProfileModal = async () => {
        if (!searchTerm.trim()) return;

        const userId = await fetchUserIdByName(searchTerm)
        if (userId) {
            setSelectedUserId(userId);
            setSelectedLevelId(undefined);
            setSelectedMode('profile')
            setModalVisible(true)
        } else {
            alert("User not found")
        }

    };

    const handleLevelModal = async (levelId: string) => {
        console.log("here", levelId)
        setSelectedUserId(undefined);
        setSelectedLevelId(levelId);
        setSelectedMode('levelScores');
        setModalVisible(true);
    };

    const handleUserClick = (userId: string) => {
        setSelectedUserId(userId);
        setSelectedLevelId(undefined);
        setSelectedMode('profile')
        setModalVisible(true)
    }


    if (loading) {
        return null;
    }

    return (

        <View style={globalStyles.container}>
            <View style={{
                backgroundColor: '#000000dd'
            }}>
                <View style={{
                    width: '85%',
                    backgroundColor: 'black',
                    borderRadius: 10,
                    padding: 10
                }}>
                    <TextInput
                        style={globalStyles.input}
                        placeholder="Search username"
                        placeholderTextColor="#888"
                        onChangeText={setSearchTerm}
                    />
                    <TouchableOpacity style={[
                        globalStyles.button
                    ]}
                        onPress={handleProfileModal}>
                        <Text style={globalStyles.buttonText}>Search user</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                <DropDownPicker
                    style={{
                        backgroundColor: "gray", borderColor: 'rgb(97, 40, 112)',
                    }}
                    open={isLevelPickerOpen}
                    value={levelPickerValue}
                    items={pickerLevelOptions}
                    setOpen={setIsLevelPickerOpen}
                    setValue={setLevelPickerValue}
                    setItems={setPickerLevelOptions}
                    onChangeValue={(val) => {
                        if (val) {
                            handleLevelModal(val);
                        }
                    }}

                />
            </View>
            <View>
                <SegmentedButtons
                    theme={{ roundness: 2 }}
                    style={styles.selector}
                    value={statCategory}
                    multiSelect={false}
                    onValueChange={(val) => {
                        if (val === "totalScore" || val === "totalRuns") {
                            setStatCategory(val);
                        }
                    }}
                    buttons={[
                        {
                            value: "totalScore",
                            label: "Total Score",
                            uncheckedColor: "white",
                        },
                        {
                            value: "totalRuns",
                            label: "Total Runs",
                            uncheckedColor: "white",
                        },

                    ]}
                />
                <Text style={styles.scoreText}>
                    {statCategory === 'totalScore' ?
                        "Leaderboard: Total Score" :
                        "Leaderboard: Total Runs"
                    }
                </Text>
                <FlatList
                    data={dataToRender}

                    renderItem={({ item }) =>
                        <View style={globalStyles.listRow}>
                            <View style={globalStyles.listCell}>
                                <TouchableOpacity onPress={() => handleUserClick(item.id)}>
                                    <Text style={globalStyles.listCellLinkText}>{item.username}</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={globalStyles.listCell}>
                                {statCategory === 'totalScore' ? item.totalScore : item.totalRuns}
                            </Text>
                        </View>}
                    ListHeaderComponent={() => (
                        <View style={[globalStyles.listRow, { borderBottomWidth: 1, borderBottomColor: '#444' }]}>
                            <Text style={[globalStyles.listCell, globalStyles.listHeader]}>User</Text>
                            <Text style={[globalStyles.listCell, globalStyles.listHeader]}>
                                {statCategory === 'totalScore' ? 'Total score' : 'Total runs'}
                            </Text>
                        </View>
                    )}

                />
            </View>
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


const styles = StyleSheet.create({
    scoreContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#333',
        borderRadius: 10,
    },
    scoreText: {
        color: 'white',
        fontSize: 18,
        marginVertical: 5,
        marginLeft: 5
    },
    listitems: {
        flexDirection: "row",

    },
    selector: {
        marginTop: 10
    },
});