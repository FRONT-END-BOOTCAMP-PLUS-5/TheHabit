'use client'
import {useRouter, useSearchParams} from "next/navigation";


const BackComponent = () => {
    const router = useRouter()
    const goBack = () => {
        router.back()
    }
    return <p onClick={goBack}>{"< 뒤로가기 임시"}</p>
}


const FollowPage = () => {
    const searchParams = useSearchParams();
    const nickname = searchParams.get("nickname");
    const type = searchParams.get("t");

    return (
        <main>
            <BackComponent />
            <p>{nickname}</p>
            <p>{type}</p>
        </main>
    );
};

export default FollowPage