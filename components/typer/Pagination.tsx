'use client';

import { PaginationInfo } from '@/app/api/typer';
import { txt } from '@/nls/texts';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface PaginationProps {
    pagination: PaginationInfo;
    fetchEvents: (page: number) => void;
}

export default function Pagination({
    pagination,
    fetchEvents,
}: PaginationProps) {
    return (
        <div className='mt-6 flex items-center justify-center gap-4'>
            {pagination.prev_page && (
                <button
                    className='rounded border px-4 py-2 disabled:opacity-50'
                    onClick={() => fetchEvents(pagination.prev_page || 1)}
                    disabled={pagination.is_first_page}
                >
                    <FaArrowLeft />
                </button>
            )}
            <span className='px-4 py-2'>
                {txt.events.page} {pagination.current_page} {txt.events.from}{' '}
                {pagination.total_pages}
            </span>
            {pagination.next_page && (
                <button
                    className='rounded border px-4 py-2 disabled:opacity-50'
                    onClick={() => fetchEvents(pagination.next_page || 1)}
                    disabled={pagination.is_last_page}
                >
                    <FaArrowRight />
                </button>
            )}
        </div>
    );
}
