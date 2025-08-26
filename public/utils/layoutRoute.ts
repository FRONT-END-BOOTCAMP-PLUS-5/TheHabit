import { PATHS_HIDING_HEADER_AND_TAB, PATHS_SHOWING_HEADER_AND_TAB, PATHS_SHOWING_TAB_ONLY } from "@/public/consts/routeName";

const matchesAny = (target: string, prefixes: string[]) =>
  prefixes.some(
    prefix => target === prefix || target.startsWith(`${prefix}/`) || target.startsWith(prefix)
  );

export const useLayoutRoute = (pathname: string) => {
  // 헤더/탭 모두 숨김 (루트 정확 일치, 혹은 지정된 경로 프리픽스)
  if (pathname === '/' || matchesAny(pathname, PATHS_HIDING_HEADER_AND_TAB)) {
    return { showHeader: false, showTab: false } ;
  }

  // 탭만 노출
  if (matchesAny(pathname, PATHS_SHOWING_TAB_ONLY)) {
    return { showHeader: false, showTab: true } ;
  }

  // 헤더와 탭 모두 노출
  if (matchesAny(pathname, PATHS_SHOWING_HEADER_AND_TAB)) {
    return { showHeader: true, showTab: true } ;
  }

  return { showHeader: false, showTab: false } ;
};