import searchIcon from '@/public/icons/search.svg';
import feedbackIcon from '@/public/icons/feedback.svg';
import alarmIcon from '@/public/icons/alarm.svg';
import profileIcon from '@/public/icons/profile.svg';
import activeSearchIcon from '@/public/icons/activeSearch.svg';
import activeFeedbackIcon from '@/public/icons/activeFeedback.svg';
import activeAlarmIcon from '@/public/icons/activeAlarm.svg';
import activeProfileIcon from '@/public/icons/activeProfile.svg';

export const getTabItems = (nickname: string) => ([
  {
    name: 'search',
    icon: searchIcon,
    href: '/user/follow',
    isHover: activeSearchIcon,
  },

  {
    name: 'feedback',
    icon: feedbackIcon,
    href: `/user/feedback/${nickname}`,
    isHover: activeFeedbackIcon,
  },
  
  {
    name: 'alarm',
    icon: alarmIcon,
    href: '/alarm',
    isHover: activeAlarmIcon,
  },
  {
    name: 'profile',
    icon: profileIcon,
    href: `/user/profile/${nickname}`,
    isHover: activeProfileIcon,
  },
]);

// 기존 코드와의 호환성을 위한 기본 export
export const tabItem = getTabItems('');
