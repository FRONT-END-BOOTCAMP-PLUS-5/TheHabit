import homeIcon from "@/public/icons/home.svg";
import searchIcon from "@/public/icons/search.svg";
import alarmIcon from "@/public/icons/alarm.svg";
import settingIcon from "@/public/icons/setting.svg";
import activeHomeIcon from "@/public/icons/activeHome.svg";
import activeSearchIcon from "@/public/icons/activeSearch.svg";
import activeAlarmIcon from "@/public/icons/activeAlarm.svg";
import activeSettingIcon from "@/public/icons/activeSetting.svg";

export const tabItem = [
  {
    name: "home",
    icon: homeIcon,
    href: "/",
    isHover: activeHomeIcon,
  },
  {
    name: "search",
    icon: searchIcon,
    href: "/search",
    isHover: activeSearchIcon,
  },

  {
    name: "alarm",
    icon: alarmIcon,
    href: "/alarm",
    isHover: activeAlarmIcon,
  },
  {
    name: "setting",
    icon: settingIcon,
    href: "/setting",
    isHover: activeSettingIcon,
  },
];
