import {NextRequest, NextResponse} from "next/server";
import {PrUserRepository} from "@/backend/users/infrastructures/repositories/PrUserRepository";
import {DeleteUserUsecase} from "@/backend/users/applications/usecases/DeleteUserUsecase";

const repository = new PrUserRepository();

const createDeleteUser = () => {
    return new DeleteUserUsecase(repository);
}



export async function DELETE(request: NextRequest): Promise<NextResponse | undefined> {
    try{
        const { id } = await request.json();

        if(!id) throw new Error("사용자 아이디가 존재하지 않습니다!");

        const usecase = createDeleteUser();
        const deletedUserRegister = await usecase.execute(id);

        return NextResponse.json({
            success: true,
            data: deletedUserRegister,
            message: "success"
        }, { status: 201 });
    }catch(err){
        if(err instanceof Error) return NextResponse.json({
            success: false,
            error: {
                code: err.message || "DELETE_FAILED",
                message: "fail"
            }
        }, { status: 500 });
    }
}
