import { db } from "@/firebaseConfig";
import { getAuth } from "firebase/auth";
import { doc, runTransaction, serverTimestamp } from "firebase/firestore";

const auth = getAuth();
const user = auth.currentUser;

export async function updateUserTotalScore(score: number, time: number, steps: number) {

    if (!user) {
        console.error("User not found");
        return;
    }

    const userRef = doc(db, "users", user.uid);

    console.log(time)

    try {
        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef);

            if (!userDoc.exists()) {
                throw new Error("User not found");
            }

            const newTotalScore = (userDoc.data().totalScore || 0) + score;
            const newTotalTime = (userDoc.data().totalTime || 0) + time;
            const newTotalSteps = (userDoc.data().totalSteps || 0) + steps;

            transaction.update(userRef, {
                totalScore: newTotalScore,
                totalTime: newTotalTime,
                totalSteps: newTotalSteps,
                lastRun: serverTimestamp(),
            });
        });
    } catch (error) {
        console.error("Error updating user total scores:", error);
    }
}