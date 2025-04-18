import { fetchUserById, UserProfile } from "@/firebase/usersService";
import { formatTimestamp } from "@/scripts/formatTimestamp";
import { globalStyles } from "@/styles/globalStyles";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View, } from "react-native";

type ProfileScoresModalProps = {
    visible: boolean;
    onClose: () => void;
    userId?: string;
    levelId?: string;
};

export default function ProfileScoresModal({ visible, onClose, userId, levelId, }: ProfileScoresModalProps) {
    const [profileData, setProfileData] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [levelData, setLevelData] = useState<string | null>(null);
    const [previousUserId, setPreviousUserId] = useState<string | null>(null);
    const [previousLevelId, setPreviousLevelId] = useState<string | null>(null);

    const isProfileMode = !!userId;
    const isLevelScoresMode = !!levelId && !userId;

    useEffect(() => {
        if (!visible) return;

        const loadProfileData = async () => {
            if (userId && userId === previousUserId && profileData) {
                // Sama käyttäjä jo haettu, ei tehdä mitään
                return;
            }

            try {
                setLoading(true);
                if (userId) {
                    const data = await fetchUserById(userId);
                    setProfileData(data);
                    setPreviousUserId(userId);
                }
            } catch (err) {
                console.error("Error loading profile", err);
            } finally {
                setLoading(false);
            }
        };

        loadProfileData();
    }, [userId, visible]);

    useEffect(() => {
        if (!visible || !levelId) return;
        if (levelId === previousLevelId && levelData) return;

        const loadLevelScores = async () => {
            try {
                setLoading(true);
                const data = await fetchScoresByLevel(levelId); // tämä sun pitää toteuttaa
                setLevelData(data);
                setPreviousLevelId(levelId);
            } catch (err) {
                console.error("Error loading level scores", err);
            } finally {
                setLoading(false);
            }
        };

        loadLevelScores();
    }, [levelId, visible]);

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View
                style={[
                    globalStyles.container,
                    { justifyContent: "center", alignItems: "center" },
                ]}
            >
                <View style={styles.modal}>
                    <TouchableOpacity
                        style={[
                            globalStyles.button,
                            {
                                position: "absolute",
                                top: 10,
                                right: 10,
                                backgroundColor: "transparent",
                            },
                        ]}
                        onPress={onClose}
                    >
                        <Text style={[globalStyles.buttonText, { fontSize: 24 }]}>✕</Text>
                    </TouchableOpacity>

                    {loading ? (
                        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
                    ) : isProfileMode && profileData ? (
                        <View>
                            <Text style={[globalStyles.title, { textAlign: "center" }]}>
                                {profileData.username}
                            </Text>

                            <Text style={globalStyles.contentText}>
                                Last run: {formatTimestamp(profileData.lastRun)}
                            </Text>
                            <Text style={globalStyles.contentText}>
                                Total steps: {profileData.totalSteps}
                            </Text>
                            <Text style={globalStyles.contentText}>
                                Total time: {profileData.totalTime}
                            </Text>
                            <Text style={globalStyles.contentText}>
                                Total score: {profileData.totalScore}
                            </Text>
                            <Text
                                style={[globalStyles.contentText, { marginTop: 10 }]}
                            >
                                Levels completed: {Object.keys(profileData.bestScores ?? {}).length}
                            </Text>

                            <FlatList
                                data={Object.entries(profileData.bestScores ?? {})}
                                keyExtractor={([level]) => level}
                                renderItem={({ item }) => {
                                    const [level, scoreData] = item;
                                    return (
                                        <TouchableOpacity onPress={() => handleLevelPress(level)}>
                                            <View style={globalStyles.contentContainer}>
                                                <Text style={globalStyles.contentText}>Level {level}</Text>
                                                <Text style={globalStyles.contentText}>Score: {scoreData.score}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                }}
                                style={{ marginTop: 20 }}
                            />
                        </View>
                    ) : isLevelScoresMode ? (
                        <Text style={globalStyles.contentText}>
                            LevelScoresMode toteutus tähän...
                        </Text>
                    ) : (
                        <Text style={globalStyles.contentText}>No data to show.</Text>
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
});
