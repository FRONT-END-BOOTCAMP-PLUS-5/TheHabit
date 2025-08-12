import { NextRequest, NextResponse } from "next/server";
import {GetUserRoutineCompletion} from "@/backend/users/applications/usecases/GetUserRoutineCompletion";
import {PrUserRepository} from "@/backend/users/infrastructures/repositories/PrUserRepository";

const repository = new PrUserRepository();

const createGetUserRoutineCompletion = () => {
    return new GetUserRoutineCompletion(repository);
}


export async function GET(request: NextRequest): Promise<NextResponse | undefined> {
    try{
        const nickname = request.nextUrl.searchParams.get('nickname');

        if(!nickname) throw new Error("사용자 닉네임이 존재하지 않습니다!");

        const usecase = createGetUserRoutineCompletion();
        const userRoutineCompletion = await usecase.execute(nickname);

        return NextResponse.json({
            success: true,
            data: userRoutineCompletion,
            message: "success"
        }, { status: 201 });
    }catch(err){
        if(err instanceof Error) return NextResponse.json({
            success: false,
            error: {
                code: err.message || "GET_FAILED",
                message: "fail"
            }
        }, { status: 500 });
    }
}

