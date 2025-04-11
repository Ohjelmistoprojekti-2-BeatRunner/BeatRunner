import { collection, getDocs, doc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { getAuth } from 'firebase/auth';

interface Song {
    id: string;
    name: string;
    bpm: number;
}

export function useDatabase() {

    const fetchLevels = async () => {

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
            throw error;
        }

    }

    const fetchSongs = async (songIds: string[]) => {

        const ids = typeof songIds[0] === "string" ? songIds[0].split(",") : songIds;

        if (!ids.length) {
            return [];
        }

        const songPromises = ids.map(async (id) => {
            try {
                const songDocRef = doc(db, 'songs', id);
                const songDoc = await getDoc(songDocRef);

                if (songDoc.exists()) {
                    const songData = songDoc.data();
                    return {
                        id: songDoc.id,
                        name: songData.name || '',
                        bpm: songData.bpm || 0
                    };
                } else {
                    return { id: id, name: "Unknown", bpm: 0 };
                }
            } catch (error) {
                console.error(`Error fetching song with ID ${id}:`, error);
            }
        });

        const songs = await Promise.all(songPromises);
        const validSongs: Song[] = songs.filter((song): song is Song => song !== undefined);

        console.log(validSongs);

        return validSongs;
    };

    async function submitRunScore(score: number) {
        const auth = getAuth();
        const user = auth.currentUser;
      
        if (!user) {
          console.error("User not found");
          return;
        }
      
        try {
          await addDoc(collection(db, "scores"), {
            userId: user.uid,
            score,
            timestamp: serverTimestamp()
          });
        } catch (error) {
          console.error("Error submitting scores:", error);
        }
      }



    return { fetchLevels, fetchSongs, submitRunScore };

}