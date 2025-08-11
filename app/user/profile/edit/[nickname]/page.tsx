"use client";
import React, {useEffect, useState} from "react";
import { Logo } from "@/app/_components/logos/logo";
import { Button } from "@/app/_components/buttons/Button";
import {useUploadProfile} from "@/libs/hooks/signup/useUploadProfile";
import {ProfileImage} from "@/app/_components/profile-images/ProfileImage";
import Image from "next/image";
import {NameComponent} from "@/app/user/profile/edit/components/Name";
import {NicknameComponent} from "@/app/user/profile/edit/components/Nickname";
import {updateUserProfile, usersApi} from "@/libs/api/users.api";
import {useRouter} from "next/navigation";
import {BackComponent} from "@/app/user/profile/edit/components/Back";

// 나중에 전역관리로 할꺼 같으니까 우선은 final화 시킴 follow 페이지에도 사용할꺼임
const NICK_NAME = "노석준11";
const ID = "a70ecc14-fb02-41ce-8f1d-750a69f5558d";
const PROFILE_IMG_PATH = '';

const UserProfileEditPage= () => {
    const router = useRouter();
    const [profilePreview, setProfilePreview] = useState<string | null>('');

    const {
        handleImageClick,
        fileInputRef,
    } = useUploadProfile();

    const { deleteRegister } = usersApi;

    const handleDeleteUserRegister = async () => {
        //나중에 confirm창으로 추가 validation 해야함!
        const response = await deleteRegister('c9b19711-c2f8-44e0-8f41-087d76d8b63e');
        if(response.data) router.push("/login")
    }

    const handleFileChange = async (evt: React.ChangeEvent<HTMLInputElement>) => {
        const file = evt.target.files?.[0];
        if (file) {
            // 나중에 유저 프로필 받아와서 있으면은 update, 없으면은 created 분기로 처리해야함 로그인 언제됨~?
            const type = PROFILE_IMG_PATH ? 'update' : 'create'

            const formData = new FormData();
            formData.append("id", ID);
            formData.append("profile_img_path", PROFILE_IMG_PATH);
            formData.append("file", file);
            formData.append("type", type);

            const response = await updateUserProfile(ID, formData);
            const img = response.data?.profileImg as string;
            setProfilePreview(img);
        }
    }

    useEffect(() => {

    },[])

    return (
        <main>
            <section id="logo_wrapper" className="positive pt-[10px]">
                <BackComponent />
            </section>
            <section id="top" className="flex mt-10 justify-center items-center px-5">
                <section id="top_wrapper" className="flex flex-col  w-[100%]">
                    <div id="user_wrapper" className="flex text-center items-end justify-between px-5 pt-[110px]">
                        <div className="relative w-30 h-30 rounded-full bg-[#F5F5F5] bottom-[40px]">
                            <ProfileImage
                                imageSrc={profilePreview || null}
                                className="w-full h-full object-cover"
                                wrapperWidth={30}
                                wrapperHeight={30}
                            />
                            <Image
                                src="/icons/camera.svg"
                                alt="프로필 업로드"
                                width={24}
                                height={24}
                                className="absolute bottom-0 right-0 cursor-pointer z-10 border border-light-gray bg-white rounded-full"
                                onClick={handleImageClick}
                            />
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                        </div>
                        <div id="challenge" className="flex flex-col items-start">
                            <div className="flex flex-col mb-5 items-start absolute top-[100px] w-[240px] text-left">
                                <NameComponent/>
                                <NicknameComponent/>
                            </div>
                            <div className="text-[#ccc]">
                                <span className="font-bold">99일</span><br/>진행중
                            </div>
                        </div>
                        <div className="cursor-not-allowed text-[#ccc]">
                            <span className="font-bold">99</span>
                            <br/>
                            <span>팔로워</span>
                        </div>
                        <div className="cursor-not-allowed text-[#ccc]">
                            <span className="font-bold">99</span>
                            <br/>
                            <span>팔로잉</span>
                        </div>
                    </div>
                    <div id="button_wrapper" className="flex justify-end gap-10 mt-10 px-5">
                        <Button type="default" color="default" className="w-[100px]" onClick={handleDeleteUserRegister}>
                            회원탈퇴
                        </Button>
                    </div>
                    <div id="routine_wrapper" className="flex flex-col py-8 gap-1 px-5 text-[#ccc]">
                        <p className="w-[100%]">금주 21일째 실천중! 💦</p>
                        <p className="w-[100%]">금주 21일째 실천중! 💦</p>
                        <p className="w-[100%]">금주 21일째 실천중! 💦</p>
                        <p className="w-[100%]">금주 21일째 실천중! 💦</p>
                        <p className="w-[100%]">금주 21일째 실천중! 💦</p>
                    </div>
                    <div id="achievement_wrapper">
                        <div>
                        </div>
                    </div>
                </section>
            </section>
            <section id="bottom">

            </section>
        </main>
    )
}

export default UserProfileEditPage