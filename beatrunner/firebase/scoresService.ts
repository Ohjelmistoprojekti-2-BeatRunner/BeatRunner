import { db } from "@/firebaseConfig";
import { getAuth } from "firebase/auth";
import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";

const auth = getAuth();
const user = auth.currentUser;

export async function submitRunScore(score: number, levelId: string,) {
    const numericLevelId = parseInt(levelId, 10);


    try {
        await addDoc(collection(db, "scores"), {
            userId: user?.uid,
            score: score,
            levelId: numericLevelId,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error("Error submitting scores:", error);
    }
}


export const fetchUserResults = async () => {
   
    try {
        const userResultsQuery = query(collection(db, 'scores'), where('userId', '==', user?.uid));
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
        console.error("Error fetching results: ", error);
        return [];
    }

}
