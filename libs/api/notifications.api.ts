import { axiosInstance } from '@/libs/axios/axiosInstance';
import { 
  PushSubscriptionDto, 
  CreatePushSubscriptionRequestDto,
  UnsubscribePushNotificationRequestDto 
} from '@/backend/notifications/applications/dtos/PushSubscriptionDto';

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

// 편의 함수들
export const notificationsApi = {
  subscribe: subscribePushNotification,
  unsubscribe: unsubscribePushNotification,
};