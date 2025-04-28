import { useUserContext } from "@/contexts/UserContext";
import { fetchLevelById } from "@/firebase/levelsService";
import { fetchLevelTopResultsWithUsername, Score } from "@/firebase/scoresService";
import { fetchUserById, UserProfile } from "@/firebase/usersService";
import { formatTimestamp } from "@/scripts/formatTimestamp";
import { globalStyles as gs } from "@/styles/globalStyles";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";


type ProfileScoresModalProps = {
    visible: boolean;
    onClose: () => void;
    userId?: string;
    levelId?: string;
    mode: "profile" | "levelScores"
};


// Modal displays either a user profile or the results for a apecific level. 
// Clicking a username in the level's score list or a level title in user's results opens the corresponding page
// App keeps the previous user profile and the previous level page in memory to avoid unnecessary database fetches

export default function ProfileScoresModal({ visible, onClose, userId, levelId, mode }: Readonly<ProfileScoresModalProps>) {
    const [selectedMode, setSelectedMode] = useState<"profile" | "levelScores">(mode)
    const [currentUserId, setCurrentUserId] = useState<string | undefined>(userId);
    const [currentLevelId, setCurrentLevelId] = useState<string | undefined>(levelId);
    const [profileData, setProfileData] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [levelData, setLevelData] = useState<Score[]>([]);
    const [previousUserId, setPreviousUserId] = useState<string | null>(null);
    const [previousLevelId, setPreviousLevelId] = useState<string | null>(null);
    const [levelTitle, setLevelTitle] = useState<string | null>(null);

    const { height: screenHeight } = Dimensions.get('window');

    const { bestScores, userData } = useUserContext();



    useEffect(() => {
        if (!visible) return;
        setCurrentUserId(userId);
        setCurrentLevelId(levelId);
        setSelectedMode(mode);
    }, []);

    // Fetch data for "profile view" mode
    useEffect(() => {
        const fetchProfile = async () => {
            if (!currentUserId || selectedMode !== 'profile') return;
            // Check if data for user already fetched:
            if (currentUserId === previousUserId && profileData) return;
            setLoading(true);
            try {
                const data = await fetchUserById(currentUserId);
                console.log("Fetched data for user: ", currentUserId);
                setProfileData(data);
                setPreviousUserId(currentUserId);
            } catch (error) {
                console.error("Error fetching profile: ", error);
            } finally {
                setLoading(false);
            }
        };
        if (visible) {
            fetchProfile();
        }
    }, [currentUserId, visible, selectedMode]);

    // Fetch data for "level view" mode
    useEffect(() => {
        const fetchLevel = async () => {
            if (!currentLevelId || selectedMode !== 'levelScores') return;

            // Avoid re-fetching if the data for the current level is already loaded
            if (currentLevelId === previousLevelId && levelData) return;
            setLoading(true);
            try {
                const data = await fetchLevelTopResultsWithUsername(currentLevelId);
                console.log("Fetched data for level: ", currentLevelId);
                setLevelData(data);

                // Fetch level metadata (e.g., title)
                const level = await fetchLevelById(currentLevelId);
                setLevelTitle(level?.title ?? "Unknown");
                console.log("Fetched title for level: ", level?.title);
                setPreviousLevelId(currentLevelId);
            } catch (error) {
                console.error("Error fetching levelr results: ", error);
            } finally {
                setLoading(false);
            }
        };

        if (visible) {
            fetchLevel();
        }
    }, [currentLevelId, visible, selectedMode]);

    // Clicked level title in modal: change to "level view".
    const handleLevelClick = (levelId: string) => {
        setCurrentLevelId(levelId);
        setSelectedMode('levelScores')
    }
    // Clicked username in modal: change to user "profile view".
    const handleUserClick = (userId: string) => {
        setCurrentUserId(userId);
        setSelectedMode('profile')
    }

    // Render "profile view": data is fetched in fetchProfile useEffect-hook.  
    const returnProfile = () => {
        if (profileData) return (

            <View style={{ flex: 1 }}>
                <View style={{ paddingBottom: 10 }}>
                    <Text style={[gs.title, { textAlign: "center" }]}>
                        {profileData.username}
                    </Text>
                </View>
                <View style={[gs.statContentContainer, { boxShadow: 'inset 0 1px 20px 3px #111' }]}>
                    <View style={gs.statContentRow}>
                        <Text style={gs.statRowTitle}>Profile created:</Text>
                        <Text style={gs.statRowText}>{formatTimestamp(profileData.createdAt)}</Text>
                    </View>
                    <View style={gs.statContentRow}>
                        <Text style={gs.statRowTitle}>Last run:</Text>
                        <Text style={gs.statRowText}>{formatTimestamp(profileData.lastRun)}</Text>
                    </View>
                </View>
                <View style={[gs.statContentContainer, { boxShadow: 'inset 0 1px 20px 3px #111', }]}>
                    <View style={gs.statContentRow}>
                        <Text style={gs.statRowTitle}>Total steps:</Text>
                        <Text style={gs.statRowText}>{profileData.totalSteps}</Text>
                    </View>
                    <View style={gs.statContentRow}>
                        <Text style={gs.statRowTitle}>Total runs:</Text>
                        <Text style={gs.statRowText}>{profileData.totalRuns}</Text>
                    </View>
                    <View style={gs.statContentRow}>
                        <Text style={gs.statRowTitle}>Total score:</Text>
                        <Text style={gs.statRowText}>{profileData.totalScore}</Text>
                    </View>
                </View>
                <View style={[gs.statContentContainer, { boxShadow: 'inset 0 1px 20px 3px #111', }]}>
                    <View style={gs.statContentRow}>
                        <Text style={gs.statRowTitle}>Levels completed:</Text>
                        <Text style={gs.statRowText}>{Object.keys(profileData.bestScores ?? {}).length} </Text>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <FlatList
                        style={{ marginTop: 10, flex: 1 }}
                        data={Object.entries(profileData.bestScores ?? {})}
                        keyExtractor={([level]) => level}
                        renderItem={({ item }) => {
                            const [level, scoreData] = item;
                            return (
                                <View style={gs.listRow}>
                                    <View style={gs.listCell}>
                                        <TouchableOpacity onPress={() => handleLevelClick(level)}>
                                            <Text style={gs.listCellLinkText}>{scoreData.title}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={gs.listCell}> {scoreData.score}</Text>
                                    <Text style={gs.listCell}>{formatTimestamp(scoreData.timestamp)}</Text>
                                </View>
                            );
                        }}
                        ListHeaderComponent={() => (
                            <View style={[gs.listRow, { borderBottomWidth: 2, }]}>
                                <Text style={[gs.listCell, gs.listHeader]}>Level</Text>
                                <Text style={[gs.listCell, gs.listHeader]}>Score</Text>
                                <Text style={[gs.listCell, gs.listHeader]}>Time</Text>
                            </View>
                        )}
                    />
                </View>
            </View>

        )
    }

    // Render "level view": data is fetched in fetchLevel useEffect-hook.  
    const returnLevelScores = () => (
        <View style={{ flex: 1 }}>
            <View style={{ paddingBottom: 10 }}>
                <Text style={[gs.title, { textAlign: "center" }]}>
                    {levelTitle}
                </Text>
            </View>
            <View style={[gs.statContentContainer, { boxShadow: 'inset 0 1px 20px 3px #111', }]}>
                <View style={gs.statContentRow}>
                    <Text style={gs.statRowTitle}>
                        {
                            currentLevelId && userData && bestScores[currentLevelId]
                                ? `Your best score`
                                : "You haven't completed level yet!"
                        }
                    </Text>
                    <Text style={gs.statRowText}>
                        {
                            currentLevelId && userData && bestScores[currentLevelId]
                                ? `${bestScores[currentLevelId].score}`
                                : ""
                        }
                    </Text>
                </View>
            </View>
            <View style={{ flex: 1 }}>
                <FlatList
                    style={{ flex: 1 }}
                    data={levelData}
                    renderItem={({ item }) =>
                        <View style={gs.listRow}>
                            <View style={gs.listCell}>
                                <TouchableOpacity onPress={() => handleUserClick(item.userId)}>
                                    <Text style={gs.listCellLinkText}>{item.username}</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={gs.listCell}>{item.score}</Text>
                            <Text style={gs.listCell}>{formatTimestamp(item.timestamp)}</Text>
                        </View>}
                    ListHeaderComponent={() => (
                        <View style={[gs.listRow, { borderBottomWidth: 2, }]}>
                            <Text style={[gs.listCell, gs.listHeader]}>User</Text>
                            <Text style={[gs.listCell, gs.listHeader]}>Score</Text>
                            <Text style={[gs.listCell, gs.listHeader]}>Time</Text>
                        </View>
                    )}
                />
            </View>
        </View>
    )


    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}>
            <View
                style={[
                    gs.container, {
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: 'rgba(0, 0, 0, 0.8)'
                    },
                ]}
            >
                {/*Close Modal on press outside modal-box*/}
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
                <View style={[styles.modal, {
                    height: screenHeight * 0.85,
                }]}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                    {loading && (
                        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
                    )}
                    {!loading && selectedMode === 'profile' && profileData && (
                        returnProfile()
                    )}
                    {!loading && selectedMode === 'levelScores' && (
                        returnLevelScores()
                    )}

                    {!loading && !selectedMode && (
                        <Text style={gs.contentText}>No data to show.</Text>
                    )}
                </View>
            </View>
        </Modal >
    );
}

const styles = StyleSheet.create({
    modal: {
        width: "95%",
        backgroundColor: "#111",
        padding: 20,
        borderWidth: 2,
        borderColor: 'rgb(97, 40, 112)',
        borderRadius: 15,
        boxShadow: '3px 3px 4px rgb(89, 34, 104)',
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: 'rgba(226, 44, 250, 0.18)',
        boxShadow: 'inset 0 1px 2px 3px #111',
        borderRadius: 30,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },

    closeButtonText: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
});
