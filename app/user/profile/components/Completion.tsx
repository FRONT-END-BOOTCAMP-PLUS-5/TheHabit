"use client";

import { useGetUserCompletion } from "@/libs/hooks/user-hooks/useGetUserCompletion";
import { useInView } from 'react-intersection-observer';
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {Button} from "@/app/user/profile/components/Button";
import {userRoutineCompletionsBtn} from "@/public/consts/userRoutineCompletionsBtn";
import {BUTTONCLASS, CATEGORYCOLOR} from "@/public/consts/userRoutineCompletionsBtnColor";
import None from "@/app/_components/none/None";


export const CompletionComponent = () => {
    const [getSelectedCategory, setSelectedCategory] = useState<string>('All');
    const [getUserClicked, setUserClicked] = useState<boolean>(false);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
    } = useGetUserCompletion('참치마요', getSelectedCategory);

    const rootRef = useRef<HTMLUListElement>(null);

    const { ref, inView } = useInView({
        root: rootRef.current,
        threshold: 0,
    });

    const selectCategory = (categoryId: string) => {
        setSelectedCategory(categoryId);
        setUserClicked(true);
    };

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView]);

    const allCompletions = data?.pages.flatMap(page => page.data) || [];

    let contentToRender = null;

    if (isLoading) {
        contentToRender = (
            // 임시 ㅋ
            <div className="flex items-center justify-center h-[450px] text-gray-500">
                <p>데이터를 불러오는 중...</p>
            </div>
        );
    } else if (allCompletions.length === 0 && getUserClicked) {
        contentToRender = <None />;
    } else {
        contentToRender = (
            <ul className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-1 overflow-y-scroll scroll-smooth max-h-[450px]' ref={rootRef}>
                {
                    allCompletions.map((item, idx: number) => {
                        const isLastItem = idx === allCompletions.length - 1;
                        return (
                            <li key={item.id} className='relative aspect-square cursor-pointer' ref={isLastItem ? ref : null}>
                                <Image
                                    src={item.proofImgUrl || ''}
                                    alt='유저 컴플리션 인증 사진들'
                                    fill
                                    className='object-cover rounded-sm'
                                    sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 33vw'
                                />
                            </li>
                        );
                    })
                }
            </ul>
        );
    }

    return (
        <>
            <section id='btn_section' className='flex justify-center gap-[10px] mb-[10px] font-semibold text-[12px]'>
                {userRoutineCompletionsBtn.map((item, _) => {
                    const isSelected = getSelectedCategory === item.id;
                    const selectedClass = isSelected ? CATEGORYCOLOR[item.id] : 'bg-white text-[#333]';

                    return (
                        <Button key={item.id} className={`${BUTTONCLASS} ${selectedClass}`} onClick={() => {
                            selectCategory(item.id);
                        }}>{
                            item.id !== 'All' && <Image
                                src={item.icon}
                                alt={item.alt}
                                width={16}
                                height={12}
                                className='opacity-80'
                            />
                        }
                            {item.label}</Button>
                    );
                })}
            </section>
            {contentToRender}
        </>
    );
};