"use client";
import {Button} from "@/app/_components/buttons/Button";
import {followsApi} from "@/libs/api/follows.api";
import {useState} from "react";

interface User{
    id: string
    username: string
    nickname: string
    profileImg: string | null
    isFollowing?: boolean
}

interface IList{
    data: User
    type: 'follower' | 'following';
}

const ID = "88b3e620-52d9-4a5c-bb2b-1dfc9a2d1a10";

export const ListComponent = ({ data, type }: IList) => {
    const { add, unfollow } = followsApi;
    const [getDisabled, setDisabled] = useState<boolean>(false)
    const [getFollow, setFollow] = useState<boolean | undefined>(data.isFollowing)

    const handleToggleFollow = async () => {
        setDisabled(true)
        if(data.isFollowing){
            const result = await unfollow(ID,data.id)
            if(result.message === "unfollow") {
                setFollow(false)
                data.isFollowing = false
            }
        }else{
            const result = await add(ID,data.id)
            if(result.message === "follow") {
                setFollow(true)
                data.isFollowing = true
            }
        }
        setDisabled(false)
    }
    return (
        <li key={data.id} className="flex justify-between items-center mb-8">
            <div id="follower_users" className="flex items-center gap-2">
                <div className="w-[80px] h-[80px] bg-black rounded-full">{data.profileImg}</div>
                <div className="flex flex-col">
                    <span className="text-[14px] text-[#1f2328]">{data.username}</span>
                    <span className="text-[10px] mt-2 text-[#59636e]">{"("+data.nickname+")"}</span>
                </div>
            </div>
            <Button type="default" color="default" className="w-[76px]" disabled={getDisabled} onClick={() => {
                handleToggleFollow()
            }}>
                {getFollow ? "Unfollow" : "Follow"}
            </Button>
        </li>
    )
}