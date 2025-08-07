import { Logo } from "../../../_components/Logo/logo";
import Button from "../../../_components/Button/Button";
import Link from "next/link";

const UserProfilePage= async () => {
    return (
        <main>
            <Logo />
            <section id="top" className="flex mt-10 justify-center items-center px-5">
                <section id="top_wrapper" className="flex flex-col  w-[100%]">
                    <div id="user_wrapper" className="flex text-center items-end justify-between px-5">
                        <div id="test_img" className="rounded-full w-[100] h-[100] bg-black"/>
                        <div id="challenge">
                            <p className="font-semibold mb-5">노석준</p>
                            <div>
                                <span className="font-bold">99일</span><br/>진행중
                            </div>
                        </div>
                        {/*nickname으로 이동할꺼 같음*/}
                        <Link href={{
                            pathname: "/user/follow",
                            query: {nickname: "원영씨...", t: "follower"}
                        }}>
                            <div className="cursor-pointer">
                                <span className="font-bold">99</span>
                                <br/>
                                <span>팔로워</span>
                            </div>
                        </Link>
                        <Link href={{
                            pathname: "/user/follow",
                            query: {nickname: "원영씨...", t: "following"}
                        }}>
                            <div className="cursor-pointer">
                                <span className="font-bold">99</span>
                                <br/>
                                <span>팔로잉</span>
                            </div>
                        </Link>
                    </div>
                    <div id="button_wrapper" className="flex justify-center gap-10 mt-10 px-5">
                        <Button type="default" color="default">
                            {/*임시 챌린지 이동 나중에 이동하는 param값 줘야함*/}
                            <Link href="/challenges">
                                챌린지 보기
                            </Link>
                        </Button>
                        <Button type="default" color="default">
                            프로필 편집
                        </Button>
                    </div>
                    <div id="routine_wrapper" className="flex flex-col py-8 gap-1">
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

export default UserProfilePage