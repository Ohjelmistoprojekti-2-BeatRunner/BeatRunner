import { Level } from "@/firebase/levelsService";
import { fetchAllUserResults } from "@/firebase/scoresService";
import { fetchAllUsers, UserProfile } from "@/firebase/usersService";
import React, { useEffect, useState } from "react";

export interface UserResults {
    levelId: string;
    userId: string;
    score: number;
    timestamp: number;
}


// Not in use

export const useGetResults = () => {
    const [allUsersResults, setAllUsersResults] = useState<UserResults[]>([]);
    //const [userResults, setUserResults] = useState<UserResults[]>([]);
    const [value, setValue] = React.useState<number>(1);
    const [levels, setLevels] = useState<Level[]>([])
    const [allUsers, setAllUsers] = useState<UserProfile[]>([])

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const userData = await fetchAllUsers();
        const allUsersResultsData = await fetchAllUserResults();

        setAllUsers(userData)
        setAllUsersResults(allUsersResultsData)
    }

    const getUserName = (userId: string) => {
        if (!allUsers || allUsers.length == 0) {
            return null
        }
        let userName = allUsers.filter(result => result.id === userId)
        if (userName.length === 0 || !userName[0]) {
            return ""
        } else {
            return userName[0].username
        }
    }

    const getLevelResults = (levelId: string) => {
        if (!allUsersResults || allUsersResults.length == 0) {
            return null
        }
        const levelIdInt = levelId;
        let level = allUsersResults.filter(result => result.levelId === levelIdInt)
        return level
    }
    
    return { getUserName, getLevelResults }
}