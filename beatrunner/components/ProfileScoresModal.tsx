import { useUserContext } from "@/contexts/UserContext";
import { fetchLevelById } from "@/firebase/levelsService";
import { fetchLevelTopResultsWithUsername, Score } from "@/firebase/scoresService";
import { fetchUserById, UserProfile } from "@/firebase/usersService";
import { useGetResults } from "@/hooks/useGetResults";
import { formatTimestamp } from "@/scripts/formatTimestamp";
import { globalStyles as gs } from "@/styles/globalStyles";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Modal, Pressable, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, } from "react-native";
import { ScrollView } from "react-native-gesture-handler";


type ProfileScoresModalProps = {
    visible: boolean;
    onClose: () => void;
    userId?: string;
    levelId?: string;
    mode: "profile" | "levelScores"
};

export default function ProfileScoresModal({ visible, onClose, userId, levelId, mode }: ProfileScoresModalProps) {
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

    const { user, bestScores, userData, loading: authLoading } = useUserContext();
    const { getLevelResults, getUserName } = useGetResults();


    useEffect(() => {
        if (!visible) return;
        setCurrentUserId(userId);
        setCurrentLevelId(levelId);
        setSelectedMode(mode);
    }, []);

    // Fetch user profile for profile view mode
    useEffect(() => {
        const fetchProfile = async () => {
            console.log("fetch started in profile")
            if (!currentUserId || selectedMode !== 'profile') return;
            console.log("fetch profile", currentUserId)
            // check if data for user already fetched:
            if (currentUserId === previousUserId && profileData) return;
            console.log("fetch new profile")
            setLoading(true);
            try {
                const data = await fetchUserById(currentUserId);
                console.log("fetch", data)
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

    // Fetch levels scores for level scores view mode
    useEffect(() => {
        const fetchLevel = async () => {
            console.log("fetch started in level")
            if (!currentLevelId || selectedMode !== 'levelScores') return;
            console.log("fetch level", currentLevelId)
            // check if data for level already fetched:
            if (currentLevelId === previousLevelId && levelData) return;
            console.log("fetch new level")
            setLoading(true);
            try {
                const data = await fetchLevelTopResultsWithUsername(currentLevelId);
                console.log("fetch", data)
                setLevelData(data);
                const level = await fetchLevelById(currentLevelId);
                setLevelTitle(level?.title ?? "Unknown");
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

    const handleLevelClick = (levelId: string) => {
        setCurrentLevelId(levelId);
        setSelectedMode('levelScores')
    }

    const handleUserClick = (userId: string) => {
        setCurrentUserId(userId);
        setSelectedMode('profile')
    }

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View
                style={[
                    gs.container, {
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: 'rgba(0, 0, 0, 0.8)'
                    },
                ]}
            >
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

                    {/* profile mode: show users profile */}
                    {!loading && selectedMode === 'profile' && profileData && (
                        <View style={{ flex: 1 }}>
                            <View style={{ paddingBottom: 10 }}>
                                <Text style={[gs.title, { textAlign: "center" }]}>
                                    {profileData.username}
                                </Text>
                            </View>
                            <View style={[gs.statContentContainer, { boxShadow: 'inset 0 1px 20px 3px #111' }]}>
                                <View style={gs.statContentRow}>
                                    <Text style={gs.statRowTitle}>Profile created:</Text>
                                    {/*<Text style={gs.statRowText}>{formatTimestamp(profileData.createdAt)}</Text>*/}
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
                                    <Text style={gs.statRowTitle}>Total time:</Text>
                                    <Text style={gs.statRowText}>{profileData.totalTime}</Text>
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
                    )}
                    {/* levelScores mode: show best results for a level*/}
                    {!loading && selectedMode === 'levelScores' && (
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
    scoreText: {
        color: 'white',
        fontSize: 18,
        marginVertical: 5,
    },
    listitems: {
        flexDirection: "row",
        justifyContent: "space-between",

    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
        elevation: 5,
    },

    closeButtonText: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
});
