'use client';

import { txt } from '@/nls/texts';
import { EventDetail } from '@/types/events';
import ActionButton from '../buttons/ActionButton';
import { AdminOnly } from '../auth/AdminOnly';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { FaTrophy, FaClock, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import UserStats from '../ranking/UserStats';

export default function EventHeader({
    event,
    totalPoints,
    place,
}: {
    event: EventDetail;
    totalPoints?: number | undefined;
    place?: number | null | undefined;
}) {
    const router = useRouter();
    const isPastDeadline = new Date(event.deadline) < new Date();
    const deadline = new Date(event.deadline);
    const [isOpen, setIsOpen] = useState(false);

    const editEvent = useCallback(() => {
        router.replace(`/typer/event/${event.id}/admin`);
    }, [event, router]);

    return (
        <div className='border-light-gray rounded-xl border bg-white shadow-sm'>
            <button
                onClick={() => setIsOpen((o) => !o)}
                className='flex w-full cursor-pointer items-center gap-4 px-6 py-4 md:px-8 md:py-5'
            >
                <div className='text-primary-dark flex-shrink-0 rounded-lg p-2'>
                    <FaTrophy size={32} />
                </div>
                <span className='text-primary-dark flex-1 text-left text-lg font-bold'>
                    {event.name}
                </span>
                <span className='text-grey shrink-0'>
                    {isOpen ? (
                        <FaChevronUp size={20} />
                    ) : (
                        <FaChevronDown size={20} />
                    )}
                </span>
            </button>

            <div
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
                <div className='overflow-hidden'>
                    <div className='border-light-gray border-t px-6 pt-4 pb-6 md:px-8 md:pb-8'>
                        <div className='flex flex-col items-start justify-between gap-6 md:flex-row md:items-start'>
                            <div className='flex flex-col gap-3'>
                                {event.description && (
                                    <p className='text-grey text-base font-medium md:text-lg'>
                                        {event.description}
                                    </p>
                                )}
                                <div className='flex items-center gap-3'>
                                    <FaClock
                                        size={18}
                                        className={`${isPastDeadline ? 'text-dark-red' : 'text-grey'}`}
                                    />
                                    <p
                                        className={`text-sm font-semibold uppercase ${isPastDeadline ? 'text-dark-red' : 'text-grey'}`}
                                    >
                                        {txt.events.deadline}:{' '}
                                        {deadline.toLocaleDateString('pl-PL')}{' '}
                                        {deadline.toLocaleTimeString('pl-PL', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className='flex flex-row items-center gap-4 md:flex-col md:items-end'>
                                <UserStats place={place} points={totalPoints} />
                                <AdminOnly>
                                    <ActionButton
                                        label={txt.forms.edit}
                                        onClick={editEvent}
                                    />
                                </AdminOnly>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
