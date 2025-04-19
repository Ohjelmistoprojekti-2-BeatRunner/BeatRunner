import { fetchLevelById } from "@/firebase/levelsService";
import { fetchUserById, UserProfile } from "@/firebase/usersService";
import { useGetResults, UserResults } from "@/hooks/useGetResults";
import { formatTimestamp } from "@/scripts/formatTimestamp";
import { globalStyles as gs } from "@/styles/globalStyles";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View, } from "react-native";

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
    const [levelData, setLevelData] = useState<UserResults[] | null>(null);
    const [previousUserId, setPreviousUserId] = useState<string | null>(null);
    const [previousLevelId, setPreviousLevelId] = useState<string | null>(null);
    const [levelTitle, setLevelTitle] = useState<string | null>(null);

    const { getLevelResults, getUserName } = useGetResults();


    useEffect(() => {
        if (!visible) return;

        // Resetoi tilat kun modal avataan uudestaan
        setCurrentUserId(userId);
        setCurrentLevelId(levelId);
        setSelectedMode(userId ? "profile" : "levelScores");
    }, []);

    // Hakee käyttäjäprofiilin jos currentUserId vaihtuu
    useEffect(() => {
        const fetchProfile = async () => {
            if (!currentUserId) return;
            console.log("[FETCH] Haetaan profiili:", currentUserId);
            setLoading(true);
            try {
                const data = await fetchUserById(currentUserId);
                setProfileData(data);
                setPreviousUserId(currentUserId);
            } catch (err) {
                console.error("[ERROR] Profiilin haku epäonnistui:", err);
            } finally {
                setLoading(false);
            }
        };

        if (visible && currentUserId !== previousUserId) {
            fetchProfile();
        }
    }, [currentUserId, visible]);

    // Hakee levelin tiedot ja tulokset
    useEffect(() => {
        const fetchLevel = async () => {
            if (!currentLevelId) return;
            console.log("[FETCH] Haetaan leveli:", currentLevelId);
            setLoading(true);
            try {
                const data = getLevelResults(currentLevelId);
                setLevelData(data);
                const level = await fetchLevelById(currentLevelId);
                setLevelTitle(level?.title ?? "Unknown");
                setPreviousLevelId(currentLevelId);
            } catch (err) {
                console.error("[ERROR] Levelin haku epäonnistui:", err);
            } finally {
                setLoading(false);
            }
        };

        if (visible && currentLevelId !== previousLevelId) {
            fetchLevel();
        }
    }, [currentLevelId, visible]);

    const handleLevelClick = (levelId: string) => {
        setCurrentLevelId(levelId);
        setSelectedMode('levelScores')
    }

    const handleUserClick = (userId: string) => {
        setCurrentLevelId(userId);
        setSelectedMode('profile')
    }

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View
                style={[
                    gs.container,
                    { justifyContent: "center", alignItems: "center" },
                ]}
            >
                <View style={styles.modal}>
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
                                        <View style={gs.contentContainer}>
                                            <TouchableOpacity onPress={() => handleLevelClick(level)}>
                                                <Text style={gs.contentText}>
                                                    Level {level}
                                                </Text>
                                            </TouchableOpacity>
                                            <Text style={gs.contentText}>
                                                Score: {scoreData.score}
                                            </Text>
                                            <Text style={gs.contentText}>
                                                Score: {formatTimestamp(scoreData.timestamp)}
                                            </Text>
                                        </View>

                                    );
                                }}
                                style={{ marginTop: 20 }}
                            />
                        </View>
                    )}
                    {/* levelScores mode: show best results for a level*/}
                    {!loading && selectedMode === 'levelScores' && (
                        <View>
                            <Text style={styles.scoreText}>Highscores for {levelTitle}</Text>
                            <Text style={styles.scoreText}>User     Points      Time</Text>
                            <FlatList
                                data={levelData}

                                renderItem={({ item }) =>
                                    <View>

                                        <TouchableOpacity onPress={() => handleUserClick(item.userId)}>
                                            <Text style={styles.scoreText}>{getUserName(item.userId)}  </Text>
                                        </TouchableOpacity>
                                        <Text style={styles.scoreText}>{item.score}   </Text>
                                        <Text style={styles.scoreText}>{formatTimestamp(item.timestamp)}</Text>
                                    </View>}
                            />
                        </View>
                    )}

                    {!loading && !selectedMode && (
                        <Text style={gs.contentText}>No data to show.</Text>
                    )}
                </View>
            </View>
        </Modal>
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
});
