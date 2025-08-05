import Logo from "../../../_components/Logo/logo"
import { ProfileImage } from "@/app/_components/ProfileImage/ProfileImage";

const UserProfilePage = async({ params }: { params: Promise<{ slug: string }>}) => {
    const queryParam = await params
    return (
        <div className={"px-8"}>
            <Logo/>
            <ProfileImage />
            {
                /**
                 * <TopSection/>
                 * <BottomSection/>
                 * */
            }
        </div>
    )
}

export default UserProfilePage