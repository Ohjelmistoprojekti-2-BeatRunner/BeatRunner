import { auth, db } from "@/firebaseConfig";
import { addDoc, collection, doc, DocumentReference, getDoc, getDocs, limit, orderBy, query, serverTimestamp, where } from "firebase/firestore";

export interface Score {
    id: string;
    levelId: string;
    score: number;
    timestamp: number;
    userId: string;
    username?: string;
}


export async function submitRunScore(score: number, levelId: string): Promise<DocumentReference | undefined> {
    const user = auth.currentUser;

    try {
        return await addDoc(collection(db, "scores"), {
            userId: user?.uid,
            score: score,
            levelId: levelId,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error("Error submitting scores:", error);
    }
}

export const fetchLevelTopResultsWithUsername = async (levelId: string) => {

    try {
        const levelResultsQuery = query(
            collection(db, 'scores'),
            where('levelId', '==', levelId),
            orderBy("score", "desc"),
            limit(30)
        );
        const levelResultsSnapshot = await getDocs(levelResultsQuery);

        const resultsWithUsernames = await Promise.all(levelResultsSnapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();
            const userRef = doc(db, "users", data.userId);
            const userSnap = await getDoc(userRef);
            const username = userSnap.exists() ? userSnap.data().username : "Unknown";

            const result: Score = {
                id: docSnap.id,
                levelId: data.levelId,
                score: data.score,
                timestamp: data.timestamp,
                userId: data.userId,
                username,
            };

            return result;
        }));

        return resultsWithUsernames;

    } catch (error) {
        console.error("Error fetching userResults results: ", error);
        return [];
    }
}

export const fetchAllUserResults = async () => {

    try {
        const allUserResultsQuery = query(collection(db, 'scores'), orderBy("score", "desc"));
        const allUserResultsSnapshot = await getDocs(allUserResultsQuery);

        const allUserResults = allUserResultsSnapshot.docs.map(doc => {
            const data = doc.data();

            return {
                id: doc.id,
                score: data.score,
                levelId: data.levelId,
                userId: data.userId,
                timestamp: data.timestamp,
            };
        });
        return allUserResults;

    } catch (error) {
        console.error("Error fetching results: ", error);
        return [];
    }
}

//not in use anymore
export const fetchUserResults = async () => {
    const user = auth.currentUser;

    try {
        const userResultsQuery = query(collection(db, 'scores'), where('userId', '==', user?.uid), orderBy("score", "desc"));
        const userResultsSnapshot = await getDocs(userResultsQuery);

        const userResults = userResultsSnapshot.docs.map(doc => {
            const data = doc.data();

            return {
                id: doc.id,
                score: data.score,
                levelId: data.levelId,
                userId: data.userId,
                timestamp: data.timestamp,
            };
        });
        return userResults;

    } catch (error) {
        console.error("Error fetching userResults results: ", error);
        return [];
    }

}
