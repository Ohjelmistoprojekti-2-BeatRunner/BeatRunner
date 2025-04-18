import { auth, db } from "@/firebaseConfig";
import { collection, doc, DocumentData, DocumentReference, getDoc, getDocs, query, runTransaction, serverTimestamp, where } from "firebase/firestore";

interface BestScore {
    score: number;
    timestamp: number;
  }
  
  export interface UserProfile {
    id: string;
    username: string;
    email?: string;
    totalRuns?: number;
    totalSteps?: number;
    totalTime?: number;
    totalScore?: number;
    lastRun?: number;
    createdAt?: number;
    bestScores?: Record<string, BestScore>;
  }

export async function updateUserTotalScore(score: number, time: number, steps: number) {
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

//not in use anymore, handled in UserContext with snapshot.
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
};

export const getUserIdByName = async (userName: string): Promise<string | null> => {
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
  
      bestScoresSnap.forEach((doc) => {
        bestScores[doc.id] = doc.data() as BestScore;
      });
  
      return {
        id: userId,
        username: userData.username ?? "Unknown",
        email: userData.email,
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