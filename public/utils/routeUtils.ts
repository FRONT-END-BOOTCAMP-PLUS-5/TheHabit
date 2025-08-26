// 동적 경로 생성을 위한 유틸리티 함수들
export const createUserProfileRoute = (nickname: string) => `/user/profile/${nickname}`;
export const createUserFeedbackRoute = (nickname: string) => `/user/feedback/${nickname}`;
export const createUserDashboardRoute = (nickname: string) => `/user/dashboard/${nickname}`;
export const createUserSearchRoute = (nickname: string) => `/user/search/${nickname}`;
export const createUserFollowRoute = (nickname: string) => `/user/follow/${nickname}`;
export const createUserEditRoute = (nickname: string) => `/user/profile/edit/${nickname}`;

// 챌린지 관련 동적 경로
export const createChallengeRoute = (nickname: string) => `/challenges/${nickname}`;
export const createChallengeCategoryRoute = (nickname: string, categoryId: string) => 
  `/challenges/${nickname}/categories/${categoryId}`;

// 루틴 관련 동적 경로
export const createRoutineRoute = (id: string) => `/routines/${id}`;
export const createRoutineCompletionRoute = (nickname: string) => `/routine-completions/${nickname}`;

// 대시보드 동적 경로
export const createDashboardRoute = (nickname: string) => `/dashboards/${nickname}`;

// 피드백 동적 경로
export const createFeedbackRoute = (nickname: string, id: string) => `/feedback/${nickname}/${id}`;

// 팔로우 관련 동적 경로
export const createFollowerRoute = (id: string) => `/friends/follower/${id}`;
export const createFollowingRoute = (id: string) => `/friends/following/${id}`;

// 사용자 검색 및 프로필 동적 경로
export const createUserSearchByNicknameRoute = (nickname: string) => `/users/search/${nickname}`;
export const createUserProfileByNicknameRoute = (nickname: string) => `/users/profile/${nickname}`;
export const createUserReviewRoute = (nickname: string) => `/users/review/${nickname}`;
export const createUserRoutineRoute = (nickname: string) => `/users/routine/${nickname}`;
export const createUserEditByNicknameRoute = (nickname: string) => `/users/edit/${nickname}`;
export const createUsernameEditRoute = (nickname: string) => `/users/edit/username/${nickname}`;
