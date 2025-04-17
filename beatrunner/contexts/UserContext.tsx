import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { collection, doc, DocumentData, onSnapshot, query } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";

type UserContextType = {
    user: FirebaseUser | null;
    userData: DocumentData | null;
    bestScores: Record<string, any>;
    loading: boolean;
};

const UserContext = createContext<UserContextType>({
    user: null,
    userData: null,
    bestScores: {},
    loading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [userData, setUserData] = useState<DocumentData | null>(null);
    const [bestScores, setBestScores] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Unsubscribe from snapshots first to prevent issues during userAuth unsubscription
        let unsubscribeUserDoc: (() => void) | null = null;
        let unsubscribeBestScores: (() => void) | null = null;

        const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                // subsbribe to real-time updates on user's doc
                const userRef = doc(db, "users", firebaseUser.uid);
                unsubscribeUserDoc = onSnapshot(userRef, (docSnap) => {
                    setUserData(docSnap.exists() ? docSnap.data() : null);
                    setLoading(false);
                });
                // subsbribe to real-time updates on user's bestScores-collections docs
                const bestScoresRef = collection(db, "users", firebaseUser.uid, "bestScores");
                unsubscribeBestScores = onSnapshot(query(bestScoresRef), (snapshot) => {
                    const scores: Record<string, any> = {};
                    snapshot.docs.forEach((doc) => {
                        scores[doc.id] = doc.data();
                    });
                    setBestScores(scores);
                });
            } else {

                // handle logout
                if (unsubscribeUserDoc) unsubscribeUserDoc();
                if (unsubscribeBestScores) unsubscribeBestScores();
                setUserData(null);
                setBestScores({});
                setLoading(false);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    const contextValue = useMemo(() => ({
        user,
        userData,
        bestScores,
        loading,
    }), [user, userData, bestScores, loading]);

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);