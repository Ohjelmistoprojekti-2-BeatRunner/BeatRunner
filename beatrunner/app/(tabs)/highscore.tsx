import ProfileScoresModal from '@/components/ProfileScoresModal';
import { useUserContext } from '@/contexts/UserContext';
import { fetchLevels, Level } from '@/firebase/levelsService';
import { fetchUserIdByName, fetchUsersOrderByTotalRuns, fetchUsersOrderByTotalScore, UserProfile } from '@/firebase/usersService';
import { globalStyles as gs } from '@/styles/globalStyles';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { SegmentedButtons } from 'react-native-paper';

type PickerLevel = {
    label: string;
    value: string;
};

export default function ScoreScreen() {

    const [totalScoreUsers, setTotalScoreUsers] = useState<UserProfile[]>([]);
    const [totalRunsUsers, setTotalRunsUsers] = useState<UserProfile[]>([]);
    const [statCategory, setStatCategory] = useState<"totalScore" | "totalRuns">("totalScore");
    const [levels, setLevels] = useState<Level[]>([])
    const [loading, setLoading] = useState<boolean>(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);
    const [selectedLevelId, setSelectedLevelId] = useState<string | undefined>(undefined);
    const [selectedMode, setSelectedMode] = useState<'profile' | 'levelScores'>('profile');

    const [isLevelPickerOpen, setIsLevelPickerOpen] = useState(false);
    const [levelPickerValue, setLevelPickerValue] = useState(null);
    const [pickerLevelOptions, setPickerLevelOptions] = useState<PickerLevel[]>([]);;

    const { user, userData, loading: authLoading } = useUserContext();

    const dataToRender = statCategory === "totalScore" ? totalScoreUsers : totalRunsUsers;
    //gets all data from the database when app loads
    useEffect(() => {
        getData();
    }, []);
    //Gets all user information and sets the states
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
        setLoading(false)

    }

    //checks search term and sets user and mode
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
    //sets the levelId and mode to levelScores
    const handleLevelModal = async (levelId: string) => {
        console.log("here", levelId)
        setSelectedUserId(undefined);
        setSelectedLevelId(levelId);
        setSelectedMode('levelScores');
        setModalVisible(true);
    };
    //sets the levelId and mode to levelScores
    const handleUserClick = (userId: string) => {
        setSelectedUserId(userId);
        setSelectedLevelId(undefined);
        setSelectedMode('profile')
        setModalVisible(true)
    }

    //checks if user is authenticated
    if (authLoading) {
        return null;
    }

    return (

        (<View style={[gs.container, { flex: 1, }]}>
            <View style={{
                backgroundColor: '#000000dd',
            }}>
                <View style={{
                    backgroundColor: 'black',
                    borderRadius: 10,
                    padding: 10,
                    alignItems: 'center'
                }}>
                    <TextInput
                        style={gs.input}
                        placeholder="Search username"
                        placeholderTextColor="#888"
                        onChangeText={setSearchTerm}
                    />
                    <TouchableOpacity style={[
                        gs.smallButton, { marginBottom: 20, marginTop: 10, width: 130 }
                    ]}
                        onPress={handleProfileModal}>
                        <Text style={gs.buttonLabel}>Search user</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                <DropDownPicker
                    style={[gs.dropdownpicker]}
                    open={isLevelPickerOpen}
                    value={levelPickerValue}
                    items={pickerLevelOptions}
                    setOpen={setIsLevelPickerOpen}
                    setValue={setLevelPickerValue}
                    setItems={setPickerLevelOptions}
                    theme='DARK'
                    onChangeValue={(val) => {
                        if (val) {
                            handleLevelModal(val);
                        }
                    }}

                />
            </View>
            <View>
                <SegmentedButtons
                    theme={{ roundness: 2, colors: { secondaryContainer: "white", outline: 'rgb(97, 40, 112)' } }}
                    style={[gs.selector]}
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
            </View>

            {loading && (
                <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
            )}
            {!loading && (
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={dataToRender}
                        renderItem={({ item }) =>
                            <View style={gs.listRow}>
                                <View style={gs.listCell}>
                                    <TouchableOpacity onPress={() => handleUserClick(item.id)}>
                                        <Text style={gs.listCellLinkText}>{item.username}</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={gs.listCell}>
                                    {statCategory === 'totalScore' ? item.totalScore : item.totalRuns}
                                </Text>
                            </View>}
                        ListHeaderComponent={() => (
                            <View>
                                <Text style={styles.scoreText}>
                                    {statCategory === 'totalScore' ?
                                        "Leaderboard: Total Score" :
                                        "Leaderboard: Total Runs"
                                    }
                                </Text>
                                <View style={[gs.listRow, { borderBottomWidth: 2, }]}>
                                    <Text style={[gs.listCell, gs.listHeader]}>User</Text>
                                    <Text style={[gs.listCell, gs.listHeader]}>
                                        {statCategory === 'totalScore' ? 'Total score' : 'Total runs'}
                                    </Text>
                                </View>
                            </View>
                        )}

                    />
                </View>
            )}
            {
                modalVisible && (
                    <ProfileScoresModal
                        visible={modalVisible}
                        userId={selectedUserId}
                        levelId={selectedLevelId}
                        onClose={() => setModalVisible(false)}
                        mode={selectedMode}
                    />
                )
            }
        </View >)
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
        fontSize: 20,
        marginVertical: 5,
        marginTop: 10,
        marginBottom: 10
    },

});