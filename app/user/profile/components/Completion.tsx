"use client";

import { useGetUserCompletion } from "@/libs/hooks/user-hooks/useGetUserCompletion";
import { useInView } from 'react-intersection-observer';
import { useEffect, useRef } from "react";
import Image from "next/image";

export const CompletionComponent = () => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
    } = useGetUserCompletion('참치마요');

    const rootRef = useRef<HTMLUListElement>(null);

    const { ref, inView } = useInView({
        root: rootRef.current,
        rootMargin: '0px 0px 200px 0px',
        threshold: 0,
    });

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView]);

    const allCompletions = data?.pages.flatMap(page => page.data) || [];

    return (
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-1 h-[450px] overflow-y-scroll scroll-smooth" ref={rootRef}>
            {
                allCompletions.map((item, idx: number) => {
                    const isLastItem = idx === allCompletions.length - 1;
                    return (
                        <li key={item.id} className="relative aspect-square cursor-pointer" ref={isLastItem ? ref : null}>
                            <Image
                                src={item.proofImgUrl || ''}
                                alt="유저 컴플리션 인증 사진들"
                                fill
                                className="object-cover rounded-sm"
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 33vw"
                            />
                        </li>
                    );
                })
            }
        </ul>
    );
};