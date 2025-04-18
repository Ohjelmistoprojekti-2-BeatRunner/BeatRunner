import { fetchUserById, UserProfile } from "@/firebase/usersService";
import { formatTimestamp } from "@/scripts/formatTimestamp";
import { globalStyles } from "@/styles/globalStyles";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ProfileModalProps = {
    visible: boolean;
    onClose: () => void;
    userId: string;
};

export default function ProfileModal({ visible, onClose, userId }: ProfileModalProps) {
    const [profileData, setProfileData] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId || !visible) return;
        const loadProfileData = async () => {
            try {
                const data = await fetchUserById(userId);
                setProfileData(data);
            } catch (err) {
                console.error("Error loading profile", err);
            } finally {
                setLoading(false);
            }
        };
        loadProfileData();
    }, [userId, visible]);

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <View style={styles.modal}>

                    <TouchableOpacity
                        style={[globalStyles.button, { position: 'absolute', top: 10, right: 10, backgroundColor: 'transparent' }]}
                        onPress={onClose}
                    >
                        <Text style={[globalStyles.buttonText, { fontSize: 24 }]}>✕</Text>
                    </TouchableOpacity>

                    {loading || !profileData ? (
                        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
                    ) : (
                        <View>
                            <Text style={[globalStyles.title, { textAlign: 'center' }]}>{profileData.username}</Text>

                            {/*<Text style={globalStyles.contentText}>Account created: {formatTimestamp(profileData.createdAt)}</Text>*/}
                            <Text style={globalStyles.contentText}>Last run: {formatTimestamp(profileData.lastRun)}</Text>
                            <Text style={globalStyles.contentText}>Total steps: {profileData.totalSteps}</Text>
                            <Text style={globalStyles.contentText}>Total time: {profileData.totalTime}</Text>
                            <Text style={globalStyles.contentText}>Total score: {profileData.totalScore}</Text>
                            <Text style={[globalStyles.contentText, { marginTop: 10 }]}>
                                Levels completed: {Object.keys(profileData.bestScores ?? {}).length}
                            </Text>

                            <FlatList
                                data={Object.entries(profileData.bestScores ?? {})}
                                keyExtractor={([level]) => level}
                                renderItem={({ item }) => {
                                    const [level, scoreData] = item;
                                    return (
                                        <View style={globalStyles.contentContainer}>
                                            <Text style={globalStyles.contentText}>Level {level}</Text>
                                            <Text style={globalStyles.contentText}>Score: {scoreData.score}</Text>
                                        </View>
                                    );
                                }}
                                style={{ marginTop: 20 }}
                            />
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        width: "90%",
        backgroundColor: "#111",
        borderRadius: 12,
        padding: 20,
    },
})