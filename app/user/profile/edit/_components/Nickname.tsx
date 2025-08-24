import React, { useEffect, useState } from 'react';
import { updateUser } from '@/libs/api/users.api';
import { useGetUserInfo } from '@/libs/hooks/user-hooks/useGetUserInfo';

export const NicknameComponent = () => {
  const { userInfo, update } = useGetUserInfo();
  const [getState, setState] = useState<boolean>(false);
  const [getValue, setValue] = useState<string>('');
  const [getNickname, setNickname] = useState<string>(userInfo?.nickname || '');

  const handleChangeState = () => {
    setState(prev => !prev);
  };

  const handleUpdateUserNickname = async () => {
    if (getValue) {
      const formData = new FormData();
      formData.append('id', userInfo?.id || '');
      formData.append('profile_img', userInfo?.profileImg || '');
      formData.append('profile_img_path', userInfo?.profileImgPath || '');
      formData.append('username', userInfo?.username || '');
      formData.append('nickname', getValue);
      formData.append('before_nickname', userInfo?.nickname || '');

      const response = await updateUser(userInfo?.nickname || '', formData);

      if (response.success) {
        const nickname = response.data?.nickname as string;
        update({
          profileImg: userInfo?.profileImg,
          profileImgPath: userInfo?.profileImgPath,
          nickname,
          username: userInfo?.username,
        });
        setNickname(nickname);
        setState(prev => !prev);
      } else {
        alert(response.message);
        return;
      }
    } else {
      setState(prev => !prev);
      return;
    }
  };

  useEffect(() => {
    if (userInfo?.username) {
      setNickname(userInfo.nickname);
    }
  }, [userInfo]);

  return (
    <div className='flex flex-col w-[180px] relative'>
      <span className='text-[12px] text-[#2A2A2A80] '>닉네임</span>
      {getState ? (
        <div className='mb-10 z-[99999]'>
          <input
            className='border-[#ebebeb] border-b-1 focus:outline-none focus:border-[#222] w-[146px]'
            defaultValue={getNickname}
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
            onClick={handleUpdateUserNickname}
          >
            저장
          </button>
        </div>
      ) : (
        <>
          <span className='font-normal text-[#222] border-b-1 mb-3 border-[#ebebeb] w-full whitespace-nowrap overflow-hidden text-ellipsis'>
            {getNickname}
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
