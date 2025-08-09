import { Logo } from "../../../_components/logos/logo";
import { Button } from "../../../_components/buttons/Button";
import Link from "next/link";

const SELECTED = "border-b-4 border-black";
// 나중에 전역관리로 할꺼 같으니까 우선은 final화 시킴 follow 페이지에도 사용할꺼임
const NICK_NAME = "이게 도파민이지...";
const ID = "88b3e620-52d9-4a5c-bb2b-1dfc9a2d1a10";

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
                            query: {nickname: NICK_NAME, t: "follower"}
                        }}>
                            <div className="cursor-pointer">
                                <span className="font-bold">99</span>
                                <br/>
                                <span>팔로워</span>
                            </div>
                        </Link>
                        <Link href={{
                            pathname: "/user/follow",
                            query: {nickname: NICK_NAME, t: "following"}
                        }}>
                            <div className="cursor-pointer">
                                <span className="font-bold">99</span>
                                <br/>
                                <span>팔로잉</span>
                            </div>
                        </Link>
                    </div>
                    <div id="button_wrapper" className="flex justify-center gap-10 mt-10 px-5">
                        <Button type="default" color="default" className="w-[200px]">
                            {/*임시 챌린지 이동 나중에 이동하는 param값 줘야함*/}
                            <Link href="/challenges">
                                챌린지 보기
                            </Link>
                        </Button>
                        <Button type="default" color="default" className="w-[200px]">
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