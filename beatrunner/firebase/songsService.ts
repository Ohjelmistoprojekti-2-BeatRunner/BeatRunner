import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

interface Song {
    id: string;
    name: string;
    bpm: number;
}

// Fetch songs by their ids. The ids provided in a list (which is get from the level-document in the app's logic)
export const fetchSongs = async (songIds: string[]) => {

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
