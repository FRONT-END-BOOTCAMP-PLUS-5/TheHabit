import React, { useState } from 'react';
import { usersApi } from '@/libs/api/users.api';

export const NameComponent = () => {
  const [getState, setState] = useState<boolean>(false);
  const [getValue, setValue] = useState<string>('');
  const [getName, setName] = useState<string>('노석준');

  const { updateUsername } = usersApi;

  const handleChangeState = () => {
    setState(prev => !prev);
  };

  const handleUpdateUserName = async () => {
    //임시 id
    const response = await updateUsername('a70ecc14-fb02-41ce-8f1d-750a69f5558d', getValue);
    const name = response.data?.username as string;
    setName(name);
    setState(prev => !prev);
  };

  return (
    <div className='flex flex-col w-[180px] relative'>
      <span className='text-[12px] text-[#2A2A2A80] '>이름</span>
      {getState ? (
        <div className='mb-10 z-[99999]'>
          {/*나중에 api 호출로 이름값 넣어야함!*/}
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
