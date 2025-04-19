import { Level } from "@/firebase/levelsService";
import { fetchAllUserResults } from "@/firebase/scoresService";
import { fetchAllUsers, UserProfile } from "@/firebase/usersService";
import React, { useEffect } from "react";
import { useState } from "react";

export interface UserResults {
    levelId: number;
    userId: string;
    score: number;
    timestamp: number;
}


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
        //const userResultsData = await fetchUserResults();
        const allUsersResultsData = await fetchAllUserResults();

        setAllUsers(userData)
        //setUserResults(userResultsData);
        setAllUsersResults(allUsersResultsData)
    }

    const getUserName = (userId: string) => {
        return allUsers.find(user => user.id === userId)?.username ?? "";

    }
    //allUsersResults.sort((a, b) => b.score - a.score)


    const getLevelResults = (levelId: string) => {
        if (!allUsersResults || allUsersResults.length == 0) {
            return null
        }
        const levelIdInt = parseInt(levelId);
        let level = allUsersResults.filter(result => result.levelId === levelIdInt)



        return level
    }
    //console.log(levels);

    return { getUserName, getLevelResults }
}