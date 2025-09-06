import { axiosInstance } from '@/libs/axios/axiosInstance';
import { newUserDto, UserDto } from '@/backend/users/application/dtos/UserDto';
import { UserReviewDto } from '@/backend/users/application/dtos/UserReviewDto';
import { UserProfileDto } from '@/backend/users/application/dtos/UserProfileDto';

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
 * 해당 함수는 user 완료 루틴 감정표현 모두 가져오기
 * @param id: string
 * @param routineCompletionId: string
 * @return Promise<ApiResponse<User>>
 * */
export const getUserRoutineCompletionReview = async (
  nickname: string,
  routineCompletionId: string
): Promise<ApiResponse<UserReviewDto[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<UserReviewDto[]>>(
      `/api/users/review/${nickname}`,
      {
        params: {
          routineCompletionId,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 해당 함수는 Users 가져오기
 * @param id: string
 * @param toUserId: string
 * @param keyword: string
 * @return ApiResponse<UserDto[]>
 * */
export const getUsers = async (
  myNickname: string,
  fromUserId: string,
  username: string
): Promise<ApiResponse<newUserDto[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<newUserDto[]>>(`/api/users/search`, {
      params: {
        myNickname,
        username,
        fromUserId,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 해당 함수는 user nickname으로 해당 유저 완료 루틴에 감정표현 나타내기
 * @param nickname: string
 * @param explain: string
 * @param routineCompletionId: string
 * @param userId: string
 * @return Promise<ApiResponse<User>>
 * */
export const createUserRoutineCompletionEmotion = async (
  nickname: string,
  explain: string,
  routineCompletionId: string,
  userId: string
): Promise<ApiResponse<UserReviewDto>> => {
  try {
    const response = await axiosInstance.post<ApiResponse<UserReviewDto>>(
      `/api/users/review/${nickname}`,
      {
        explain,
        routineCompletionId,
        userId,
      }
    );
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
export const updateUser = async (
  nickname: string,
  formData: FormData
): Promise<ApiResponse<UserDto>> => {
  try {
    const response = await axiosInstance.post<ApiResponse<UserDto>>(
      `/api/users/edit/${nickname}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
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
export const deleteUserRegister = async (nickname: string): Promise<ApiResponse<void>> => {
  try {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/api/users/${nickname}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 해당 함수는 유저 완료 루틴에 자신이 표현한 감정표현 삭제하기
 * @param nickname: string
 * @param id: string
 * @param routineCompletionId: string
 * @param reviewContent: string
 * @return Promise<ApiResponse<void>>
 * */
export const deleteUserRoutineCompletionEmotion = async (
  nickname: string,
  id: string,
  routineCompletionId: string,
  reviewContent: string
): Promise<ApiResponse<void>> => {
  try {
    const response = await axiosInstance.delete<ApiResponse<void>>(
      `/api/users/review/${nickname}`,
      {
        data: {
          id,
          routineCompletionId,
          reviewContent,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 닉네임으로 단일 유저 프로필 정보 조회
 * @param nickname 유저 닉네임
 * @return Promise<ApiResponse<UserProfileDto>>
 */
export const getUserProfileByNickname = async (
  nickname: string
): Promise<ApiResponse<UserProfileDto>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<UserProfileDto>>(
      `/api/users/profile/${nickname}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API 편의 객체
export const usersApi = {
  getUserRoutineCompletionReview,
  createUserRoutineCompletionEmotion,
  updateUser,
  deleteUserRegister,
  getUserProfileByNickname,
};
