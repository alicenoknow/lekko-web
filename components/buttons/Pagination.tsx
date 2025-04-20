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
    const onPagePrev = useCallback(() => {
        changePage(pagination.prev_page || 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pagination.prev_page, changePage]);

    const onPageNext = useCallback(() => {
        changePage(pagination.next_page || 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pagination.next_page, changePage]);

    return (
        <div className='mt-6 flex items-center justify-center gap-4'>
            {pagination.prev_page && (
                <ActionIcon
                    label={<FaArrowLeft />}
                    onClick={onPagePrev}
                    disabled={pagination.is_first_page}
                />
            )}
            <span className='px-4 py-2'>
                {txt.events.page} {pagination.current_page} {txt.events.from}{' '}
                {pagination.total_pages}
            </span>
            {pagination.next_page && (
                <ActionIcon
                    label={<FaArrowRight />}
                    onClick={onPageNext}
                    disabled={pagination.is_last_page}
                />
            )}
        </div>
    );
}
