import searchIcon from '@/public/icons/search.svg';
import feedbackIcon from '@/public/icons/feedback.svg';
import alarmIcon from '@/public/icons/alarm.svg';
import profileIcon from '@/public/icons/profile.svg';
import activeSearchIcon from '@/public/icons/activeSearch.svg';
import activeFeedbackIcon from '@/public/icons/activeFeedback.svg';
import activeAlarmIcon from '@/public/icons/activeAlarm.svg';
import activeProfileIcon from '@/public/icons/activeProfile.svg';

export const tabItem = (nickname?: string) => ([
  {
    name: 'search',
    icon: searchIcon,
    href: nickname ? '/user/follow' : '/login',
    isHover: activeSearchIcon,
  },
  {
    name: 'feedback',
    icon: feedbackIcon,
    href: nickname ? `/user/feedback/${nickname}` : '/login',
    isHover: activeFeedbackIcon,
  },
  {
    name: 'notification',
    icon: alarmIcon,
    href: '/user/notifications',
    isHover: activeAlarmIcon,
  },
  {
    name: 'profile',
    icon: profileIcon,
    href: nickname ? `/user/profile/edit/${nickname}` : '/login',
    isHover: activeProfileIcon,
  },
]);
