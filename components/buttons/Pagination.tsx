'use client';

import { txt } from '@/nls/texts';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import ActionIcon from './ActionIcon';
import { PaginationInfo } from '@/types/pagination';
import { useCallback } from 'react';

interface PaginationProps {
    pagination: PaginationInfo;
    changePage: (page: number) => void;
}

export default function Pagination({
    pagination,
    changePage,
}: PaginationProps) {
    const { total_pages, current_page, is_first_page, is_last_page } = pagination;

    const onPagePrev = useCallback(() => {
        changePage(current_page - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [current_page, changePage]);

    const onPageNext = useCallback(() => {
        changePage(current_page + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [current_page, changePage]);

    return (
        <div className='mt-6 flex items-center justify-center gap-4'>
            {!is_first_page && (
                <ActionIcon
                    label={<FaArrowLeft />}
                    onClick={onPagePrev}
                    disabled={is_first_page}
                />
            )}
            <span className='px-4 py-2'>
                {txt.events.page} {current_page} {txt.events.from}{' '}
                {total_pages}
            </span>
            {!is_last_page && (
                <ActionIcon
                    label={<FaArrowRight />}
                    onClick={onPageNext}
                    disabled={is_last_page}
                />
            )}
        </div>
    );
}
