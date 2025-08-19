'use client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AddChallengeRequestDto } from '@/backend/challenges/applications/dtos/AddChallengeDto';
import Image from 'next/image';
import HealthIcon from '@/public/icons/icon_health.png';
import BookIcon from '@/public/icons/icon_study.svg';
import DevelopIcon from '@/public/icons/icon_develop.png';
import GuitarIcon from '@/public/icons/icon_guitar.png';
import CustomInput from '@/app/_components/inputs/CustomInput';
import { CHALLENGE_COLORS } from '@/public/consts/challengeColors';
import { useCreateChallenge } from '@/libs/hooks/challenges-hooks/useCreateChallenge';
import { useSession } from 'next-auth/react';
import { useModalStore } from '@/libs/stores/modalStore';

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
  const userNickname = useSession().data?.user.nickname;

  // 챌린지 생성 훅 사용
  const createChallengeMutation = useCreateChallenge();

  // 모달 닫기 함수
  const { closeModal } = useModalStore();

  // 시작 날짜가 변경될 때마다 종료 날짜를 21일 후로 자동 설정
  useEffect(() => {
    if (watchCreatedAt) {
      const startDate = new Date(watchCreatedAt);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 21);

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
          // 챌린지 생성 성공 시 alert 표시 후 1초 뒤 모달 닫기
          alert('챌린지 생성에 성공했습니다.');

          setTimeout(() => {
            closeModal();
          }, 500);
        } else {
          console.error('챌린지 생성 실패:', response.error?.message);
          alert('챌린지 생성에 실패했습니다: ' + response.error?.message);
        }
      },
      onError: (error: Error) => {
        console.error('챌린지 생성 중 오류 발생:', error);
        alert('챌린지 생성 중 오류가 발생했습니다: ' + error.message);
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
          {...register('name', { required: '챌린지 이름을 입력해주세요' })}
          type='text'
          id='name'
          placeholder='예: 매일 운동하기'
          onBlur={() => {}}
        />
        {errors.name && <span className='text-red-500 text-sm'>{errors.name.message}</span>}
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
            { id: 0, icon: HealthIcon, label: '건강', alt: '건강' },
            { id: 1, icon: BookIcon, label: '학습', alt: '학습' },
            { id: 2, icon: DevelopIcon, label: '자기개발', alt: '자기개발' },
            { id: 3, icon: GuitarIcon, label: '기타', alt: '기타' },
          ].map(category => (
            <div key={category.id}>
              <input
                {...register('categoryId', {
                  required: '카테고리를 선택해주세요',
                })}
                type='radio'
                value={category.id}
                id={`category-${category.id}`}
                className='sr-only'
              />
              <label
                htmlFor={`category-${category.id}`}
                className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                  Number(watchCategoryId) === category.id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-primary'
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
              </label>
            </div>
          ))}
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
