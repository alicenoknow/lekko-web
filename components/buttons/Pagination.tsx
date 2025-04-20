'use client';

import { txt } from '@/nls/texts';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import ActionIcon from './ActionIcon';
import { PaginationInfo } from '@/types/pagination';

interface PaginationProps {
    pagination: PaginationInfo;
    changePage: (page: number) => void;
}

export default function Pagination({
    pagination,
    changePage,
}: PaginationProps) {
    return (
        <div className='mt-6 flex items-center justify-center gap-4'>
            {pagination.prev_page && (
                <ActionIcon
                    label={<FaArrowLeft />}
                    onClick={() => changePage(pagination.prev_page || 1)}
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
                    onClick={() => changePage(pagination.next_page || 1)}
                    disabled={pagination.is_last_page}
                />
            )}
        </div>
    );
}
