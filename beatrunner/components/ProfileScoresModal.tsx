import { useUserContext } from "@/contexts/UserContext";
import { fetchLevelById } from "@/firebase/levelsService";
import { fetchLevelTopResultsWithUsername, Score } from "@/firebase/scoresService";
import { fetchUserById, UserProfile } from "@/firebase/usersService";
import { useGetResults } from "@/hooks/useGetResults";
import { formatTimestamp } from "@/scripts/formatTimestamp";
import { globalStyles as gs } from "@/styles/globalStyles";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, } from "react-native";

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
        <Modal visible={visible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={onClose}>
                <View
                    style={[
                        gs.container, {
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: 'rgba(0, 0, 0, 0.8)'
                        },
                    ]}
                >
                    <TouchableWithoutFeedback>
                        <View style={[styles.modal, {
                            height: screenHeight * 0.85,
                        }]}>
                            <TouchableOpacity
                                style={[
                                    gs.button,
                                    {
                                        position: "absolute",
                                        top: 10,
                                        right: 10,
                                        backgroundColor: "transparent",
                                    },
                                ]}
                                onPress={onClose}
                            >
                                <Text style={[gs.buttonText, { fontSize: 24 }]}>✕</Text>

                            </TouchableOpacity>
                            {loading && (
                                <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
                            )}

                            {/* profile mode: show users profile */}
                            {!loading && selectedMode === 'profile' && profileData && (
                                <View>
                                    <Text style={[gs.title, { textAlign: "center" }]}>
                                        {profileData.username}
                                    </Text>
                                    {/*<Text style={gs.contentText}>
                                Profile created: {formatTimestamp(profileData.createdAt)}
                            </Text>*/}
                                    <Text style={gs.contentText}>
                                        Last run: {formatTimestamp(profileData.lastRun)}
                                    </Text>
                                    <Text style={gs.contentText}>
                                        Total steps: {profileData.totalSteps}
                                    </Text>
                                    <Text style={gs.contentText}>
                                        Total time: {profileData.totalTime}
                                    </Text>
                                    <Text style={gs.contentText}>
                                        Total score: {profileData.totalScore}
                                    </Text>
                                    <Text style={[gs.contentText, { marginTop: 10 }]}>
                                        Levels completed: {Object.keys(profileData.bestScores ?? {}).length}
                                    </Text>

                                    <FlatList
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
                                            <View style={[gs.listRow, { borderBottomWidth: 1, borderBottomColor: '#444' }]}>
                                                <Text style={[gs.listCell, gs.listHeader]}>Level</Text>
                                                <Text style={[gs.listCell, gs.listHeader]}>Score</Text>
                                                <Text style={[gs.listCell, gs.listHeader]}>Time</Text>
                                            </View>
                                        )}
                                        style={{ marginTop: 20 }}
                                    />
                                </View>
                            )}
                            {/* levelScores mode: show best results for a level*/}
                            {!loading && selectedMode === 'levelScores' && (
                                <View>
                                    <Text style={styles.scoreText}>Highscores for {levelTitle}</Text>
                                    <View style={styles.listitems}>
                                        <Text style={gs.contentText}>
                                            {
                                                currentLevelId && userData && bestScores[currentLevelId]
                                                    ? `${userData.username}'s best score: ${bestScores[currentLevelId].score}`
                                                    : "You haven't completed level yet!"
                                            }
                                        </Text>
                                    </View>
                                    <FlatList
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
                                            <View style={[gs.listRow, { borderBottomWidth: 1, borderBottomColor: '#444' }]}>
                                                <Text style={[gs.listCell, gs.listHeader]}>User</Text>
                                                <Text style={[gs.listCell, gs.listHeader]}>Score</Text>
                                                <Text style={[gs.listCell, gs.listHeader]}>Time</Text>
                                            </View>
                                        )}
                                    />
                                </View>
                            )}

                            {!loading && !selectedMode && (
                                <Text style={gs.contentText}>No data to show.</Text>
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal >
    );
}

const styles = StyleSheet.create({
    modal: {
        width: "90%",
        backgroundColor: "#111",
        borderRadius: 12,
        padding: 20,
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
});
