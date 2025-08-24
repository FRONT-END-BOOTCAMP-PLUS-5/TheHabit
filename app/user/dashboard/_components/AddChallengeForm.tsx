'use client';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { AddChallengeRequestDto } from '@/backend/challenges/applications/dtos/AddChallengeDto';
import { ChallengeDto } from '@/backend/challenges/applications/dtos/ChallengeDto';
import Image from 'next/image';
import HealthIcon from '@/public/icons/icon_health.png';
import BookIcon from '@/public/icons/icon_study.svg';
import DevelopIcon from '@/public/icons/icon_develop.png';
import GuitarIcon from '@/public/icons/icon_guitar.png';
import CustomInput from '@/app/_components/inputs/CustomInput';
import { CHALLENGE_COLORS } from '@/public/consts/challengeColors';
import { useCreateChallenge } from '@/libs/hooks/challenges-hooks/useCreateChallenge';
import { useGetChallengesByNickname } from '@/libs/hooks/challenges-hooks/useGetChallengesByNickname';
import { useGetUserInfo } from '@/libs/hooks/user-hooks/useGetUserInfo';
import { useModalStore } from '@/libs/stores/modalStore';
import { Toast } from '@/app/_components/toasts/Toast';

const AddChallengeForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddChallengeRequestDto>();

  const watchCreatedAt = watch('createdAt');
  const watchCategoryId = watch('categoryId');
  const { userInfo } = useGetUserInfo();
  const userNickname = userInfo?.nickname;

  // 챌린지 생성 훅 사용
  const createChallengeMutation = useCreateChallenge();

  // 모달 닫기 함수
  const { closeModal } = useModalStore();

  // 사용자 전체 챌린지를 불러와 카테고리별 개수 계산
  const { data: userChallenges } = useGetChallengesByNickname(userNickname || '');

  // 카테고리별 챌린지 제한 (3개)
  const MAX_CHALLENGES_PER_CATEGORY = 3;

  const categoryCounts = useMemo(() => {
    const counts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
    (userChallenges || []).forEach((challenge: ChallengeDto) => {
      const cid = Number(challenge.categoryId);
      if (!Number.isNaN(cid)) counts[cid] = (counts[cid] || 0) + 1;
    });
    return counts;
  }, [userChallenges]);

  // 시작 날짜가 변경될 때마다 종료 날짜를 21일 후로 자동 설정
  useEffect(() => {
    if (watchCreatedAt) {
      const startDate = new Date(watchCreatedAt);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 20);

      // YYYY-MM-DD 형식으로 변환
      const endDateString = endDate.toISOString().split('T')[0];
      setValue('endAt', endDateString);
    }
  }, [watchCreatedAt, setValue]);

  // 카테고리가 변경될 때마다 색상을 자동으로 설정
  useEffect(() => {
    if (watchCategoryId) {
      const categoryId = Number(watchCategoryId);
      if (!isNaN(categoryId) && categoryId in CHALLENGE_COLORS) {
        const selectedColor = CHALLENGE_COLORS[categoryId as keyof typeof CHALLENGE_COLORS];
        setValue('color', selectedColor.background);
      }
    }
  }, [watchCategoryId, setValue]);

  const onSubmitHandler = (data: AddChallengeRequestDto) => {
    // 카테고리별 챌린지 개수 제한 확인 (선택된 카테고리 기준)
    const selectedCategoryId = Number(data.categoryId);
    const selectedCategoryCount = categoryCounts[selectedCategoryId] || 0;
    if (selectedCategoryCount >= MAX_CHALLENGES_PER_CATEGORY) {
      Toast.error(
        `한 카테고리에서는 최대 ${MAX_CHALLENGES_PER_CATEGORY}개까지만 챌린지를 만들 수 있습니다.`
      );
      return;
    }

    // categoryId를 숫자로 변환
    const formData = {
      ...data,
      categoryId: Number(data.categoryId),
      nickname: userNickname || '',
    };

    createChallengeMutation.mutate(formData, {
      onSuccess: response => {
        if (response.success) {
          console.log('챌린지 생성 성공:', response.message);
          // 챌린지 생성 성공 시 모달 닫기
          setTimeout(() => {
            closeModal();
            // 페이지 새로고침하여 새로운 목록을 받아옴
            setTimeout(() => {
              window.location.reload();
            }, 500); // 모달이 닫힌 후 0.5초 뒤 새로고침
          }, 500);
        } else {
          console.error('챌린지 생성 실패:', response.error?.message);
          Toast.error('챌린지 생성에 실패했습니다: ' + response.error?.message);
        }
      },
      onError: (error: Error) => {
        console.error('챌린지 생성 중 오류 발생:', error);
        Toast.error('챌린지 생성 중 오류가 발생했습니다: ' + error.message);
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className='flex flex-col items-center gap-4 p-4 w-full bg-white rounded-lg '
    >
      <div className='flex justify-between items-end w-full'>
        <h2 className='flex-1 text-2xl font-bold text-primary w-full'>새 챌린지 추가</h2>

        <div className='flex-1 text-sm text-secondary text-right'>
          21일부터 시작하는 습관 챌린지
        </div>
      </div>

      {/* 챌린지 이름 */}
      <div className='flex flex-col gap-2 w-full'>
        <label htmlFor='name' className='text-sm font-medium text-gray-700'>
          챌린지 이름 <span className='text-red-500'>*</span>
        </label>
        <CustomInput
          {...register('name', {
            required: '챌린지 이름을 입력해주세요',
            maxLength: { value: 20, message: '챌린지 이름은 20자 이내로 입력해주세요' },
          })}
          type='text'
          id='name'
          placeholder='예: 매일 운동하기 (20자 이내)'
          maxLength={20}
          onBlur={() => {}}
        />
        <div className='flex justify-between items-center'>
          {errors.name && <span className='text-red-500 text-sm'>{errors.name.message}</span>}
          <span className='text-xs text-gray-400 ml-auto'>{watch('name')?.length || 0}/20</span>
        </div>
      </div>

      {/* 시작 날짜 */}
      <div className='flex flex-col gap-2 w-full'>
        <label htmlFor='createdAt' className='text-sm font-medium text-gray-700'>
          시작 날짜 <span className='text-red-500'>*</span>
        </label>
        <CustomInput
          {...register('createdAt', { required: '시작 날짜를 선택해주세요' })}
          type='date'
          id='createdAt'
          min={new Date().toISOString().split('T')[0]}
        />
        {errors.createdAt && (
          <span className='text-red-500 text-sm'>{errors.createdAt.message}</span>
        )}
      </div>

      {/* 종료 날짜 */}
      <div className='flex flex-col gap-2 w-full'>
        <label htmlFor='endAt' className='text-sm font-medium text-gray-700'>
          종료 날짜
        </label>
        <CustomInput
          {...register('endAt', { required: '종료 날짜를 선택해주세요' })}
          type='date'
          id='endAt'
          readOnly
        />
        <span className='text-xs text-gray-500'>
          - 시작일로부터 21일 후로 자동 설정됩니다
          <br />- 66일 챌린지는 21일 챌린지 완료 후 도전 가능합니다.
        </span>
        {errors.endAt && <span className='text-red-500 text-sm'>{errors.endAt.message}</span>}
      </div>

      {/* 색상은 카테고리 선택 시 자동으로 설정됩니다 */}
      <input {...register('color', { required: '색상이 필요합니다' })} type='hidden' />

      {/* 카테고리 선택 */}
      <div className='flex flex-col gap-2 w-full'>
        <label className='text-sm font-medium text-gray-700'>
          카테고리 <span className='text-red-500'>*</span>
        </label>
        <div className='grid grid-cols-2 gap-3 w-full'>
          {[
            { id: 1, icon: HealthIcon, label: '건강', alt: '건강' },
            { id: 2, icon: BookIcon, label: '학습', alt: '학습' },
            { id: 3, icon: DevelopIcon, label: '자기개발', alt: '자기개발' },
            { id: 4, icon: GuitarIcon, label: '기타', alt: '기타' },
          ].map(category => {
            const categoryChallengeCount = categoryCounts[category.id] || 0;
            const isCategoryFull = categoryChallengeCount >= MAX_CHALLENGES_PER_CATEGORY;

            return (
              <div key={category.id}>
                <input
                  {...register('categoryId', {
                    required: '카테고리를 선택해주세요',
                  })}
                  type='radio'
                  value={category.id}
                  id={`category-${category.id}`}
                  className='sr-only'
                  disabled={isCategoryFull}
                />
                <label
                  htmlFor={`category-${category.id}`}
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all duration-200 ${
                    isCategoryFull
                      ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-50'
                      : Number(watchCategoryId) === category.id
                        ? 'border-primary bg-primary/5 cursor-pointer hover:shadow-md'
                        : 'border-gray-200 cursor-pointer hover:border-primary hover:shadow-md'
                  }`}
                >
                  <Image
                    src={category.icon}
                    alt={category.alt}
                    width={32}
                    height={32}
                    className='opacity-80'
                  />
                  <span className='text-sm font-medium text-gray-700'>{category.label}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      isCategoryFull ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {categoryChallengeCount}/{MAX_CHALLENGES_PER_CATEGORY}
                  </span>
                </label>
              </div>
            );
          })}
        </div>
        {errors.categoryId && (
          <span className='text-red-500 text-sm'>{errors.categoryId.message}</span>
        )}
      </div>

      {/* 제출 버튼 */}
      <button
        type='submit'
        className='w-full mt-4 px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-white hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer border-2 border-primary'
      >
        챌린지 추가하기
      </button>
    </form>
  );
};

export default AddChallengeForm;
