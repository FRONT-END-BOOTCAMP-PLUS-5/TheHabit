import { axiosInstance } from "@/libs/axios/axiosInstance";
import {UserDto} from "@/backend/users/applications/dtos/UserDto";
import {CreateRoutineCompletionResponseDto} from "@/backend/routine-completions/applications/dtos/RoutineCompletionDto";


// API 응답 타입 정의
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: {
        code: string;
        message: string;
    };
}


/**
 * 해당 함수는 user nickname으로 해당 유저 완료 루틴 가져오기
 * @param id: string
 * @param nickname: string
 * @return Promise<ApiResponse<User>>
 * */
export const getUserRoutineCompletion = async (nickname: string, pageparam: number, pagesize: number): Promise<ApiResponse<CreateRoutineCompletionResponseDto[]>> => {
    try {
        const response = await axiosInstance.get<ApiResponse<CreateRoutineCompletionResponseDto[]>>(`/api/users/routine/${nickname}`,{
            params: {
                nickname,
                pageparam,
                pagesize
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * 해당 함수는 user name update 하기
 * @param id: string
 * @param nickname: string
 * @return Promise<ApiResponse<User>>
 * */
export const updateUserName = async (id: string, username: string): Promise<ApiResponse<UserDto>> => {
    try {
        const response = await axiosInstance.post<ApiResponse<UserDto>>(`/api/users/edit/username/${id}`,{
            id,
            username
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};


/**
 * 해당 함수는 user nickname update 하기
 * @param id: string
 * @param nickname: string
 * @return Promise<ApiResponse<User>>
 * */
export const updateUserNickname = async (id: string, nickname: string): Promise<ApiResponse<UserDto>> => {
    try {
        const response = await axiosInstance.post<ApiResponse<UserDto>>(`/api/users/edit/nickname/${id}`,{
            id,
            nickname
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * 해당 함수는 user profile update 하기
 * @param id: string
 * @param nickname: string
 * @return Promise<ApiResponse<User>>
 * */
export const updateUserProfile = async (id: string, formData: FormData): Promise<ApiResponse<UserDto>> => {
    try {
        const response = await axiosInstance.post<ApiResponse<UserDto>>(`/api/users/edit/profile/${id}`,formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        } );
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * 해당 함수는 user 회원탈퇴 하기
 * @param id: string
 * @return Promise<ApiResponse<void>>
 * */
export const deleteUserRegister = async (id: string): Promise<ApiResponse<void>> => {
    try {
        const response = await axiosInstance.delete<ApiResponse<void>>(`/api/users/${id}`, {
            data: {
                id
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const usersApi = {
    getUserRoutineCompletion,
    updateNickname: updateUserNickname,
    updateUsername: updateUserName,
    updateUserProfile,
    deleteRegister: deleteUserRegister
};
