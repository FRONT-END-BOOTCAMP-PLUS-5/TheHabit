'use client';

import { useForegroundMessaging } from '@/libs/hooks/notifications-hooks/useForegroundMessaging';

const FcmMessagingProvider = ({ children }: { children: React.ReactNode }) => {
  useForegroundMessaging();
  return children;
};

export default FcmMessagingProvider;
