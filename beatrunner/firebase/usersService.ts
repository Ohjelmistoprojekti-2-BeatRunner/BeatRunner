import { db } from "@/firebaseConfig";
import { getAuth } from "firebase/auth";
import { doc, runTransaction, serverTimestamp, collection, getDocs, getDoc, setDoc, DocumentReference, DocumentData, orderBy, query, Timestamp, } from "firebase/firestore";

export async function updateUserTotalScore(score: number, time: number, steps: number) {

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        console.error("User not found");
        return;
    }
    const userRef = doc(db, "users", user.uid);

    try {
        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists()) {
                throw new Error("User not found");
            }
            const newTotalScore = (userDoc.data().totalScore || 0) + score;
            const newTotalTime = (userDoc.data().totalTime || 0) + time;
            const newTotalSteps = (userDoc.data().totalSteps || 0) + steps;
            const newTotalRuns = (userDoc.data().totalRuns || 0) + 1;

            transaction.update(userRef, {
                totalScore: newTotalScore,
                totalTime: newTotalTime,
                totalSteps: newTotalSteps,
                totalRuns: newTotalRuns,
                lastRun: serverTimestamp(),
            });
        });
    } catch (error) {
        console.error("Error updating user total scores:", error);
    }
}

// users/<uid>/bestScores/<levelId>/ contains updating ref to user's best result for that level. 
// the goal is to minimize firestore document reads, while keeping data consistency.
export async function updateUserBestScores(
    score: number,
    levelId: string,
    scoreRef: DocumentReference<DocumentData>
) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        console.error("User not found");
        return;
    }
    const userId = user?.uid;
    const userBestScoreRef = doc(db, `users/${userId}/bestScores/${levelId}`);

    try {
        await runTransaction(db, async (transaction) => {
            const userBestScoreSnap = await transaction.get(userBestScoreRef);
            const isBetter = !userBestScoreSnap.exists() || score > userBestScoreSnap.data().score;
            if (!isBetter) return;
            const userBestScoreData = {
                scoreDocRef: scoreRef,
                userId: userId,
                score: score,
                timestamp: serverTimestamp(),
            }
            transaction.set(userBestScoreRef, userBestScoreData);
        });
    } catch (error) {
        console.error("Error updating user best scores:", error);
    }
}

export const fetchUserBestScores = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User not found");
    }
    const userId = user?.uid;

    // get user's bestScores: a list of refs to the docs containing their best results for each level 
    const userBestScoresRef = collection(db, `users/${userId}/bestScores`);
    const userBestScoresSnapshot = await getDocs(userBestScoresRef);


    const userBestScores: any[] = [];

    for (const doc of userBestScoresSnapshot.docs) {
        const userBestScoreData = doc.data();
        const scoreDocRef = userBestScoreData.scoreDocRef as DocumentReference;
        let fullScoreData = null;

        try {
            const scoreSnap = await getDoc(scoreDocRef);
            fullScoreData = scoreSnap.exists() ? scoreSnap.data() : null;
        } catch (error) {
            console.error("Error fetching user's best scores: ", error);
            return [];
        }

        userBestScores.push({
            levelId: doc.id,
            scoreData: fullScoreData,
        });
    }

    return userBestScores;
}

export const fetchAllUsers = async () => {

    try {
        const allUsers = collection(db, 'users');
        const allUsersSnapshot = await getDocs(allUsers);

        const allUsersResults = allUsersSnapshot.docs.map(doc => {
            const data = doc.data();

            return {
                id: doc.id,
                createdAt: data.createdAt,
                email: data.email,
                username: data.username,
            };
        });
        return allUsersResults;

    } catch (error) {
        console.error("Error fetching allUsers results: ", error);
        return [];
    }

}