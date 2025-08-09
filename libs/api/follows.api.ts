import { axiosInstance } from "@/libs/axios/axiosInstance";
import { FollowerDto } from "@/backend/follows/applications/dtos/FollowerDto";
import { FollowingDto } from "@/backend/follows/applications/dtos/FollowingDto";
import {ChallengeDto} from "@/backend/challenges/applications/dtos/ChallengeDto";


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
 * 해당 함수는 following 하기
 * @param fromUserId: string
 * @param toUserId: string
 * @return Promise<ApiResponse<boolean>>
 * */
export const addFollowing = async (fromUserId: string, toUserId: string): Promise<ApiResponse<boolean>> => {
    try {
        const response = await axiosInstance.post<ApiResponse<boolean>>(`/api/following/${fromUserId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * 해당 함수는 follower 가져오기
 * @param id: string
 * @param toUserId: string
 * @param keyword: string
 * @return Promise<FollowerDto[]>
 * */
export const getFollowerByToUserId = async (toUserId: string, keyword: string): Promise<ApiResponse<FollowerDto>> => {
    try {

        const response = await axiosInstance.get<ApiResponse<FollowerDto>>(`/api/users/follower/${toUserId}`, {
            params: {
                toUserId,
                keyword
            }
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * 해당 함수는 following 가져오기
 * @param fromUserId: string
 * @param keyword: string
 * @return Promise<FollowingDto[]>
 * */
export const getFollowingByToUserId = async (fromUserId: string, keyword: string): Promise<FollowingDto> => {
    try {
        const response = await axiosInstance.get<FollowingDto>(`/api/follower/${fromUserId}`, {
            params: {
                fromUserId,
                keyword
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};


/**
 * 해당 함수는 unfollow 하기
 * @param fromUserId: string
 * @param toUserId: string
 * @return Promise<ApiResponse<void>>
 * */
export const deleteUnfollow = async (fromUserId: string, toUserId: string): Promise<ApiResponse<void>> => {
    try {
        const response = await axiosInstance.delete<ApiResponse<void>>(`/api/following/${fromUserId}`, {
            params: {
                fromUserId,
                toUserId
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const followsApi = {
    follower: getFollowerByToUserId,
    following: getFollowingByToUserId,
    add: addFollowing,
    unfollow: deleteUnfollow,
};
