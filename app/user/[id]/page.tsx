import { Logo } from "../../_components/Logo/logo";
import Button from "../../_components/Button/Button";

const UserProfilePage= async () => {

    return (
        <main>
            <Logo />
            <section id="top" className={"flex mt-10 justify-center items-center px-5"}>
                <section id="top_wrapper" className={"flex flex-col  w-[100%]"}>
                    <div id="user_wrapper" className={"flex text-center items-end justify-between px-5"}>
                        <div id="test_img" className={"rounded-full w-[100] h-[100] bg-black"}/>
                        <div id="challenge">
                            <p className={"font-semibold mb-5"}>노석준</p>
                            <div>
                                <span className={"font-bold"}>99일</span><br/>진행중
                            </div>
                        </div>
                        <div>
                            <span className={"font-bold"}>99</span>
                            <br/>
                            <span>팔로워</span>
                        </div>
                        <div>
                            <span className={"font-bold"}>99</span>
                            <br/>
                            <span>팔로잉</span>
                        </div>
                    </div>
                    <div id="button_wrapper" className="flex justify-center gap-10 mt-10 px-5">
                        <Button type="default" color="default">
                            챌린지 보기
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
                </section>
            </section>
            <section id="bottom">

            </section>
        </main>
    )
}

export default UserProfilePage