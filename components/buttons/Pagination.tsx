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
    const totalPages =
        pagination.limit > 0
            ? Math.ceil(pagination.total_count / pagination.limit)
            : 1;
    const isFirstPage = pagination.page <= 1;
    const isLastPage = pagination.page >= totalPages;

    const onPagePrev = useCallback(() => {
        changePage(pagination.page - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pagination.page, changePage]);

    const onPageNext = useCallback(() => {
        changePage(pagination.page + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pagination.page, changePage]);

    return (
        <div className='mt-6 flex items-center justify-center gap-4'>
            {!isFirstPage && (
                <ActionIcon
                    label={<FaArrowLeft />}
                    onClick={onPagePrev}
                    disabled={isFirstPage}
                />
            )}
            <span className='px-4 py-2'>
                {txt.events.page} {pagination.page} {txt.events.from}{' '}
                {totalPages}
            </span>
            {!isLastPage && (
                <ActionIcon
                    label={<FaArrowRight />}
                    onClick={onPageNext}
                    disabled={isLastPage}
                />
            )}
        </div>
    );
}
