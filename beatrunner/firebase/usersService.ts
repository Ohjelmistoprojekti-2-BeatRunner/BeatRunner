import { auth, db } from "@/firebaseConfig";
import { collection, doc, DocumentData, DocumentReference, getDoc, getDocs, limit, orderBy, query, runTransaction, serverTimestamp, where } from "firebase/firestore";

interface BestScore {
    score: number;
    timestamp: number;
    title: string;
}

// User has a bestScores collection, documents named by the level-ID, where users best result for each level is stored and updated 
export interface UserProfile {
    id: string;
    username: string;
    totalRuns?: number;
    totalSteps?: number;
    totalTime?: number;
    totalScore?: number;
    lastRun?: number;
    createdAt?: number;
    bestScores?: Record<string, BestScore>;
}

export const fetchUserIdByName = async (userName: string): Promise<string | null> => {
    try {
        const usernameQuery = query(
            collection(db, 'users'),
            where('usernameLowercase', '==', userName.trim().toLowerCase())
        );
        const querySnapshot = await getDocs(usernameQuery);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return doc.id;
        } else {
            console.warn("User not found");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user by name: ", error);
        return null;
    }

};

// Fetch an user by their Id. Also fetch their bestScores documents. 
// For each bestScore-documents get the level title, assosiated with the level-id stored in the document  
export const fetchUserById = async (userId: string): Promise<UserProfile | null> => {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            console.warn("User not found");
            return null;
        }

        const userData = userSnap.data();

        const bestScoresRef = collection(db, "users", userId, "bestScores");
        const bestScoresSnap = await getDocs(bestScoresRef);
        const bestScores: Record<string, BestScore> = {};

        for (const scoreDoc of bestScoresSnap.docs) {
            const scoreId = scoreDoc.id;
            const data = scoreDoc.data() as BestScore;

            // fetch level titles 
            const levelRef = doc(db, "levels", scoreId);
            const levelSnap = await getDoc(levelRef);
            const title = levelSnap.exists() ? levelSnap.data().title : "Unknown";

            bestScores[scoreId] = {
                ...data,
                title,
            };
        }

        return {
            id: userId,
            username: userData.username ?? "Unknown",
            totalRuns: userData.totalRuns,
            totalSteps: userData.totalSteps,
            totalTime: userData.totalTime,
            totalScore: userData.totalScore,
            lastRun: userData.lastRun,
            createdAt: userData.createdAt,
            bestScores,
        };
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return null;
    }
};

export const fetchAllUsers = async () => {

    try {
        const allUsers = collection(db, 'users');
        const allUsersSnapshot = await getDocs(allUsers);

        const allUsersResults = allUsersSnapshot.docs.map(doc => {
            const data = doc.data();

            return {
                id: doc.id,
                createdAt: data.createdAt,
                username: data.username,
            };
        });
        return allUsersResults;

    } catch (error) {
        console.error("Error fetching allUsers results: ", error);
        return [];
    }
}

// Fetch the top 20 users for the high score lists, ordered by their total score
export const fetchUsersOrderByTotalScore = async () => {
    try {
        const allUsersRef = collection(db, 'users');
        const userTotalScoreQuery = query(allUsersRef, orderBy('totalScore', 'desc'), limit(20));

        const querySnapshot = await getDocs(userTotalScoreQuery);

        if (!querySnapshot.empty) {
            const topScoreUsersResults = querySnapshot.docs.map(doc => {
                const userData = doc.data();
                return {
                    id: doc.id,
                    username: userData.username ?? "Unknown",
                    totalRuns: userData.totalRuns,
                    totalSteps: userData.totalSteps,
                    totalTime: userData.totalTime,
                    totalScore: userData.totalScore,
                    lastRun: userData.lastRun,
                    createdAt: userData.createdAt,
                };
            });
            return topScoreUsersResults;
        } else {
            console.warn("No results found");
            return [];
        };
    } catch (error) {
        console.error("Error fetching users: ", error);
        return [];
    }
}

// Fetch the top 20 users for the high score lists, ordered by their total runs
export const fetchUsersOrderByTotalRuns = async () => {
    try {
        const allUsersRef = collection(db, 'users');
        const userTotalRunsQuery = query(allUsersRef, orderBy('totalRuns', 'desc'), limit(20));

        const querySnapshot = await getDocs(userTotalRunsQuery);

        if (!querySnapshot.empty) {
            const topRunsUsersResults = querySnapshot.docs.map(doc => {
                const userData = doc.data();
                return {
                    id: doc.id,
                    username: userData.username ?? "Unknown",
                    totalRuns: userData.totalRuns,
                    totalSteps: userData.totalSteps,
                    totalTime: userData.totalTime,
                    totalScore: userData.totalScore,
                    lastRun: userData.lastRun,
                    createdAt: userData.createdAt,
                };
            });
            return topRunsUsersResults;
        } else {
            console.warn("No results found");
            return [];
        };
    } catch (error) {
        console.error("Error fetching users: ", error);
        return [];
    }
}

// After a succesful run, update user's total stats: 
// First get the old stats, add the new results to the existing ones, and then update with the new sums.  
export async function updateUserTotalScore(score: number, time: number, steps: number) {
    const user = auth.currentUser;

    if (!user) {
        console.error("User not found");
        return;
    }
    const userRef = doc(db, "users", user.uid);

    try {
        await runTransaction(db, async (transaction) => { // firebase transaction.update to prevent problems with asynchronised updates
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

// users/<uid>/bestScores/<levelId>/ contains the best score for that level,
// along with a reference to the corresponding run in the scores collection
export async function updateUserBestScores(
    score: number,
    levelId: string,
    scoreRef: DocumentReference<DocumentData>
) {
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

export const updateUserThreshold = async (threshold: number) => {
    const user = auth.currentUser;

    if (!user) {
        console.error("User not found");
        return;
    }

    const userRef = doc(db, "users", user.uid);
    console.log(threshold)
    try {
        await runTransaction(db, async (transaction) => {
            const snap = await transaction.get(userRef);
            if (!snap.exists()) throw new Error("User doc missing");
            transaction.update(userRef, { threshold: threshold });
        });
    } catch (error) {
        console.error("Transaction failed:", error);
    }
};



/*not in use anymore, handled in UserContext with snapshot.
export const fetchUserBestScores = async () => {
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

// not in use
export const fetchUserByName = async (userName: string) => {
    try {
        const usernameQuery = query(
            collection(db, 'users'),
            where('usernameLowercase', '==', userName.trim().toLowerCase()) // firestore is case-sensitive: usernameLowercase for username comparisons.
        );
        const querySnapshot = await getDocs(usernameQuery);

        if (!querySnapshot.empty) {
            return {
                id: querySnapshot.docs[0].id,
                ...querySnapshot.docs[0].data(),
            };
        } else {
            console.warn("User not found");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user by name: ", error);
        return null;
    }
};*/