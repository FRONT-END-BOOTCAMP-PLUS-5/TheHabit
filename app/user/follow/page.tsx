'use client'
import Input from "../../_components/inputs/Input";
import { Button } from "../../_components/buttons/Button";
import {useState, useRef, ChangeEvent, useEffect, useCallback} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { debounce } from 'lodash';
import { followsApi } from "@/libs/api/follows.api";
import { FollowerDto } from "@/backend/follows/applications/dtos/FollowerDto";
import { FollowingDto } from "@/backend/follows/applications/dtos/FollowingDto";

interface ICategory{
    init: () => void;
    type: 'follower' | 'following';
}

interface IContent{
    data?:  FollowerDto
}


const SELECTED = "border-b-4 border-black";
// 나중에 전역관리로 할꺼 같으니까 우선은 final화
const NICK_NAME = "이게 도파민이지...";
const ID = "88b3e620-52d9-4a5c-bb2b-1dfc9a2d1a10";

const BackComponent = () => {
    const router = useRouter();

    const handlergoBack = () => router.push(`/user/profile/${NICK_NAME}`);

    return <p onClick={handlergoBack} className="text-[40px] cursor-pointer inline">{"<"}</p>
};


const CategoryComponent = ({ init, type }: ICategory) => {
    const router = useRouter();
    const [getCategory, setCategory] = useState<'follower' | 'following'>(type);
    const handlerSelected = (category: 'follower' | 'following') => {
        init();
        router.push(`/user/follow?nickname=${NICK_NAME}&t=${category}`);
        setCategory(category);
    }

    return (
        <div id="follow_category" className="mt-5 mb-5 flex justify-around">
            <span onClick={() => {
                handlerSelected('follower');
            }} className={`text-[18px] cursor-pointer ${getCategory === "follower" ? SELECTED : ''}`}>팔로워</span>
            <span onClick={() => {
                handlerSelected('following');
            }} className={`text-[18px] cursor-pointer ${getCategory === "following" ? SELECTED : ''}`}>팔로잉</span>
        </div>
    )
};

const ContentComponent = ({ data }:IContent) => {
    console.log(data?.followers, "data")
    return (
        <div id="follow_content" className="mt-5 mb-5 flex justify-around">
            <ul className="w-full">
                {
                    data?.followers.map((follower) => {
                        return (
                            <li key={follower.fromUser.id} className="flex justify-between items-center mb-8">
                                <div id="follower_users" className="flex items-center gap-2">
                                    <div className="w-[80px] h-[80px] bg-black rounded-full">{follower.fromUser.profileImg}</div>
                                    <div className="flex flex-col">
                                        <span className="text-[14px] text-[#1f2328]">{follower.fromUser.nickname}</span>
                                        <span className="text-[10px] mt-2 text-[#59636e]">{follower.fromUser.username}</span>
                                    </div>
                                </div>
                                <Button type="default" color="default" className="w-[60px]">
                                  Follow
                                </Button>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}


const FollowPage = () => {
    const searchParams = useSearchParams();
    const nickname = searchParams.get("nickname");
    const type = searchParams.get("t");

    const [getFollows, setFollows] = useState<FollowerDto>()
    const [getInputText, setInputText] = useState<string>('')


    const {follower, following, add, unfollow } = followsApi;


    const init = () => {
        setInputText('');
    }


    const handleSearch = useCallback(debounce(async (evt: ChangeEvent<HTMLInputElement>) => {
        await getFollower(evt.target.value);
    },500),[]);

    const getFollower = async (keyword:string = '') => {
        const response = await follower(ID, keyword);
        setFollows(response.data);
    };

    useEffect(() => {
        (async function(){
            if(type === "follower") await getFollower();
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
                    handleSearch(evt);
                }} value={getInputText} />
            </section>
            <section id="content">
                {
                    type === "follower" && <ContentComponent data={getFollows}/>
                }
            </section>
        </main>
    );
};

export default FollowPage