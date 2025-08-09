'use client'
import Input from "../../_components/inputs/Input";
import {useState, useEffect, useCallback} from "react";
import {  useSearchParams } from "next/navigation";
import { debounce } from 'lodash';
import { followsApi } from "@/libs/api/follows.api";
import { FollowerDto } from "@/backend/follows/applications/dtos/FollowerDto";
import { FollowingDto } from "@/backend/follows/applications/dtos/FollowingDto";
import {BackComponent} from "@/app/user/follow/components/Back";
import {CategoryComponent} from "@/app/user/follow/components/Category";
import {ContentComponent} from "@/app/user/follow/components/Content";


// 나중에 전역관리로 할꺼 같으니까 우선은 final화
const NICK_NAME = "이게 도파민이지...";
const ID = "88b3e620-52d9-4a5c-bb2b-1dfc9a2d1a10";

const FollowPage = () => {
    const searchParams = useSearchParams();
    const nickname = searchParams.get("nickname");
    const type = searchParams.get("t");

    const [getFollows, setFollows] = useState<FollowerDto | FollowingDto>()
    const [getInputText, setInputText] = useState<string>('')


    const {follower, following } = followsApi;


    const init = () => {
        setInputText('');
    }


    const handleSearch = useCallback(debounce(async (value: string) => {
        if(type === "follower" || type === "following") await getFollow(type, value);
    },500),[type]);

    const getFollow = async (type:'follower' | 'following', keyword:string = '') => {
        const response = type === 'follower' ?  await follower(ID, keyword) : await following(ID, keyword);
        setFollows(response?.data);
    };

    useEffect(() => {
        (async function(){
            if(type === "follower" || type === "following") await getFollow(type);
        }());
    },[type]);

    return (
        <main className="px-5">
            <section id="head">
                <div id="follow_wrapper" className="flex items-center gap-[5.8rem]">
                    <BackComponent />
                    <p className="pt-2 font-bold text-[20px] w-[200] text-center whitespace-nowrap overflow-hidden text-ellipsis">{nickname}</p>
                </div>
                <CategoryComponent init={init} type={type as 'follower'| 'following'}/>
                <Input placeholder="Search" onChange={(evt) => {
                    setInputText(evt.target.value);
                    handleSearch(evt.target.value);
                }} value={getInputText} />
            </section>
            <section id="content">
                <ContentComponent data={getFollows}/>
            </section>
        </main>
    );
};

export default FollowPage