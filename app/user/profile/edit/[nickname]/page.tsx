"use client";
import {useEffect} from "react";
import { Logo } from "@/app/_components/logos/logo";
import { Button } from "@/app/_components/buttons/Button";
import {useUploadProfile} from "@/libs/hooks/signup/useUploadProfile";
import {ProfileImage} from "@/app/_components/profile-images/ProfileImage";
import Image from "next/image";
import {NameComponent} from "@/app/user/profile/edit/components/Name";
import {NicknameComponent} from "@/app/user/profile/edit/components/Nickname";
import {usersApi} from "@/libs/api/users.api";
import {useRouter} from "next/navigation";

// 나중에 전역관리로 할꺼 같으니까 우선은 final화 시킴 follow 페이지에도 사용할꺼임
const NICK_NAME = "이게 도파민이지...";
const ID = "88b3e620-52d9-4a5c-bb2b-1dfc9a2d1a10";

const UserProfileEditPage= () => {
    const router = useRouter()
    const {
        profilePreview,
        handleImageClick,
        handleFileChange,
        fileInputRef,
        profileFile,
    } = useUploadProfile();

    const { deleteRegister } = usersApi;
    console.log(profileFile, "preview")

    const handleDeleteUserRegister = async () => {
        //나중에 confirm창으로 추가 validation 해야함!
        const response = await deleteRegister('c9b19711-c2f8-44e0-8f41-087d76d8b63e');
        if(response.data) router.push("/login")
    }

    useEffect(() => {

    },[])

    return (
        <main>
            <Logo />
            <section id="top" className="flex mt-10 justify-center items-center px-5">
                <section id="top_wrapper" className="flex flex-col  w-[100%]">
                    <div id="user_wrapper" className="flex text-center items-end justify-between px-5 pt-[110px]">
                        <div className="relative w-30 h-30 rounded-full bg-[#F5F5F5] bottom-[40px]">
                            <ProfileImage
                                imageSrc={profilePreview || null}
                                className="w-full h-full object-cover"
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