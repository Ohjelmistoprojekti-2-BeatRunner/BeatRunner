import { db } from '@/firebase/firebaseConfig';
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';

export interface Level {
    id: string;
    title: string;
    levelOrder: number;
    difficulty: string;
    calories: number;
    duration: number;
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
            duration: levelData.duration,
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
        const levelsQuery = query(levelsCollection, orderBy('levelOrder'))
        
        const levelsSnapshot = await getDocs(levelsQuery);

        const levels = levelsSnapshot.docs.map(doc => {
            const data = doc.data();

            return {
                id: doc.id,
                title: data.title,
                levelOrder: data.levelOrder,
                difficulty: data.difficulty,
                calories: data.calories,
                duration: data.duration,
                songs: data.songs,
            };
        });

        return levels;

    } catch (error) {
        console.error("Error fetching levels: ", error);
        return [];
    }

}


