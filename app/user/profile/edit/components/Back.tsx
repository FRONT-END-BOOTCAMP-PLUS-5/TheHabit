import {useRouter} from "next/navigation";

const NICK_NAME = "이게 도파민이지...";

export const BackComponent = () => {
        const router = useRouter();

    const handlergoBack = () => router.push(`/user/profile/${NICK_NAME}`);

    return <p onClick={handlergoBack} className="text-[40px] cursor-pointer inline pl-[20px] absolute top-[-8px] left-0">{"<"}</p>
};