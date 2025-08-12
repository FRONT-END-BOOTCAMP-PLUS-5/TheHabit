import {NextRequest, NextResponse} from "next/server";
import {PrUserRepository} from "@/backend/users/infrastructures/repositories/PrUserRepository";
import {UpdateUserProfileImgUsecase} from "@/backend/users/applications/usecases/UpdateUserProfileImgUsecase";

const repository = new PrUserRepository();

const createUpdateUserProfileImgUsecase = () => {
    return new UpdateUserProfileImgUsecase(repository);
}


export async function POST(request: NextRequest): Promise<NextResponse | undefined> {
    try{
        const data = await request.formData();
        const id = data.get("id") as string;
        const userProfileImgPath = data.get("profile_img_path") as string;
        const file = data.get("file") as File;
        const type = data.get("type") as 'create' | 'update';


        if(!id) throw new Error("사용자 아이디가 존재하지 않습니다!");


        const usecase = createUpdateUserProfileImgUsecase();
        const updatedUserProfileImg = await usecase.execute(id, userProfileImgPath, file, type);

        return NextResponse.json({
            success: true,
            data: updatedUserProfileImg,
            message: "success"
        }, { status: 201 });
    }catch(err){
        if(err instanceof Error) return NextResponse.json({
            success: false,
            error: {
                code: err.message || "POST_FAILED",
                message: "fail"
            }
        }, { status: 500 });
    }
}