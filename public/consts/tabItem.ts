import searchIcon from '@/public/icons/search.svg';
import feedbackIcon from '@/public/icons/feedback.svg';
import alarmIcon from '@/public/icons/alarm.svg';
import profileIcon from '@/public/icons/profile.svg';
import activeSearchIcon from '@/public/icons/activeSearch.svg';
import activeFeedbackIcon from '@/public/icons/activeFeedback.svg';
import activeAlarmIcon from '@/public/icons/activeAlarm.svg';
import activeProfileIcon from '@/public/icons/activeProfile.svg';

export const tabItem = [
  {
    name: 'search',
    icon: searchIcon,
    href: '/user/follow',
    isHover: activeSearchIcon,
  },

  {
    name: 'feedback',
    icon: feedbackIcon,
    href: '/user/feedback',
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
    href: '/user/profile/edit',
    isHover: activeProfileIcon,
  },
];
