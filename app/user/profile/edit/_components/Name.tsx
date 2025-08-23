import React, { useState, useEffect } from 'react';
import { updateUser } from '@/libs/api/users.api';
import { useGetUserInfo } from '@/libs/hooks/user-hooks/useGetUserInfo';

export const NameComponent = () => {
  const { userInfo, update } = useGetUserInfo();
  const [getState, setState] = useState<boolean>(false);
  const [getValue, setValue] = useState<string>('');
  const [getName, setName] = useState<string>(userInfo?.username || '');

  const handleChangeState = () => {
    setState(prev => !prev);
  };

  const handleUpdateUserName = async () => {
    if (getValue) {
      const formData = new FormData();
      formData.append('id', userInfo?.id || '');
      formData.append('profile_img', userInfo?.profileImg || '');
      formData.append('profile_img_path', userInfo?.profileImgPath || '');
      formData.append('username', getValue);
      formData.append('nickname', userInfo?.nickname || '');
      const response = await updateUser(userInfo?.nickname || '', formData);
      const username = response.data?.username as string;
      update({
        profileImg: userInfo?.profileImg,
        profileImgPath: userInfo?.profileImgPath,
        nickname: userInfo?.nickname,
        username,
      });
      setName(username);
      setState(prev => !prev);
    } else {
      setState(prev => !prev);
      return;
    }
  };

  useEffect(() => {
    if (userInfo?.username) {
      setName(userInfo.username);
    }
  }, [userInfo]);

  return (
    <div className='flex flex-col w-[180px] relative'>
      <span className='text-[12px] text-[#2A2A2A80] '>이름</span>
      {getState ? (
        <div className='mb-10 z-[99999]'>
          <input
            className='border-[#ebebeb] border-b-1 focus:outline-none focus:border-[#222] w-[146px]'
            defaultValue={getName}
            onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
              setValue(evt.target.value);
            }}
          />
          <button
            className='absolute w-[50px] h-[34px] top-[5px] right-[-20] cursor-pointer text-[12px] rounded-lg border-[#d3d3d3] border-1'
            onClick={handleChangeState}
          >
            취소
          </button>
          <button
            className='absolute w-[50px] h-[34px] top-[5px] right-[-80] cursor-pointer text-[12px] rounded-lg bg-[#222] text-[#fff]'
            onClick={handleUpdateUserName}
          >
            저장
          </button>
        </div>
      ) : (
        <>
          <span className='font-normal text-[#222] border-b-1 mb-3 border-[#ebebeb] w-full whitespace-nowrap overflow-hidden text-ellipsis'>
            {getName}
          </span>
          <button
            className='absolute w-[50px] h-[34px] top-1 right-[-50] cursor-pointer text-[12px] rounded-lg border-[#d3d3d3] border-1'
            onClick={handleChangeState}
          >
            변경
          </button>
        </>
      )}
    </div>
  );
};
