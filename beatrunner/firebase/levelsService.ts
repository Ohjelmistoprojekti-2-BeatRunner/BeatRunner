import { db } from '@/firebaseConfig';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

export interface Level {
    id: string;
    title: string;
    difficulty: string;
    calories: number;
    songs: [];
}


export const fetchLevelById = async (levelId: string) => {
    try {
        const levelRef = doc(db, "levels", levelId);
        const levelSnap = await getDoc(levelRef);

        if (!levelSnap.exists()) {
            console.warn("Level not found");
            return null;
        }
        const levelData = levelSnap.data();

        return {
            id: levelId,
            title: levelData.title,
            difficulty: levelData.difficulty,
            calories: levelData.calories,
        };
    } catch (error) {
        console.error("Error fetching level by ID:", error);
        return null;
    }
};

export const fetchLevels = async () => {
    try {
        const levelsCollection = collection(db, 'levels');
        const levelsSnapshot = await getDocs(levelsCollection);

        const levels = levelsSnapshot.docs.map(doc => {
            const data = doc.data();

            return {
                id: doc.id,
                title: data.title,
                difficulty: data.difficulty,
                calories: data.calories,
                songs: data.songs,
            };
        });

        return levels;

    } catch (error) {
        console.error("Error fetching levels: ", error);
        return [];
    }

}


