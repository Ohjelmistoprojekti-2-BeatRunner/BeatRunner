import { db } from '@/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

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


