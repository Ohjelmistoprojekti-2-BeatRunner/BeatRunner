import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

const fetchLevels = async () => {
  try {
    const levelsCollection = collection(db, "levels");
    const levelsSnapshot = await getDocs(levelsCollection);

    const levels = levelsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          difficulty: data.difficulty,
          calories: data.calories,
        };
      });

    return levels;
  } catch (error) {
    console.error("Error fetching levels: ", error);
    throw error;
  }
};

export default fetchLevels;
