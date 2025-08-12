"use client";

import {usersApi} from "@/libs/api/users.api";
import {useEffect, useState} from "react";

export const CompletionComponent = () => {
    const { getUserRoutineCompletion } = usersApi;
    const [getCompletions, setCompletions] = useState([])
    
    useEffect(() => {
        (async function(){
            const response = await getUserRoutineCompletion('참치마요')

        }())

    },[])
    
    return <div>1234</div>
};