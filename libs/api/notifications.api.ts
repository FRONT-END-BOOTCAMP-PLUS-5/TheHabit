import { axiosInstance } from '@/libs/axios/axiosInstance';
import {
  PushSubscriptionDto,
  CreatePushSubscriptionRequestDto,
  UnsubscribePushNotificationRequestDto,
} from '@/backend/notifications/application/dtos/PushSubscriptionDto';
import { FcmTokenDto } from '@/backend/notifications/application/dtos/FcmTokenDto';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';

// 1. 푸시 알림 구독
export const subscribePushNotification = async (
  subscriptionData: Omit<CreatePushSubscriptionRequestDto, 'userId'>
): Promise<ApiResponse<PushSubscriptionDto>> => {
  try {
    const response = await axiosInstance.post<ApiResponse<PushSubscriptionDto>>(
      '/api/notifications/subscribe',
      subscriptionData
    );
    return response.data;
  } catch (error) {
    console.error('푸시 알림 구독 실패:', error);
    throw error;
  }
};

// 2. 푸시 알림 구독 해제
export const unsubscribePushNotification = async (
  subscriptionData: Omit<UnsubscribePushNotificationRequestDto, 'userId'>
): Promise<ApiResponse<null>> => {
  try {
    const response = await axiosInstance.post<ApiResponse<null>>(
      '/api/notifications/unsubscribe',
      subscriptionData
    );
    return response.data;
  } catch (error) {
    console.error('푸시 알림 구독 해제 실패:', error);
    throw error;
  }
};

// 3. FCM 토큰 저장 (Firebase Console 테스트용)
export const saveFcmToken = async (token: string): Promise<ApiResponse<FcmTokenDto>> => {
  try {
    const response = await axiosInstance.post<ApiResponse<FcmTokenDto>>(
      '/api/notifications/fcm-token',
      { token }
    );
    return response.data;
  } catch (error) {
    console.error('FCM 토큰 저장 실패:', error);
    throw error;
  }
};

// 4. FCM 토큰 삭제
export const clearFcmToken = async (): Promise<ApiResponse<null>> => {
  try {
    const response = await axiosInstance.delete<ApiResponse<null>>('/api/notifications/fcm-token');
    return response.data;
  } catch (error) {
    console.error('FCM 토큰 삭제 실패:', error);
    throw error;
  }
};

// 편의 함수들
export const notificationsApi = {
  subscribe: subscribePushNotification,
  unsubscribe: unsubscribePushNotification,
  saveFcmToken,
  clearFcmToken,
};
