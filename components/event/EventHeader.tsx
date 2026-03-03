import { txt } from '@/nls/texts';
import { EventDetail } from '@/types/events';
import ActionButton from '../buttons/ActionButton';
import { AdminOnly } from '../auth/AdminOnly';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { MdEmojiEvents } from 'react-icons/md';
import { FaClock, FaCheckCircle } from 'react-icons/fa';

export default function EventHeader({ event }: { event: EventDetail }) {
    const router = useRouter();
    const isPastDeadline = new Date(event.deadline) < new Date();
    const deadline = new Date(event.deadline);

    const editEvent = useCallback(() => {
        router.replace(`/typer/event/${event.id}/admin`);
    }, [event, router]);

    return (
        <div className='border-light-gray rounded-xl border bg-white p-6 shadow-sm md:p-8'>
            <div className='flex flex-col items-start justify-between gap-6 md:flex-row md:items-start'>
                {/* Left side: Title and info */}
                <div className='flex flex-1 flex-col gap-4'>
                    <div className='flex items-center gap-4'>
                        <div className='bg-blue-accent text-primary-dark flex-shrink-0 rounded-lg p-3'>
                            <MdEmojiEvents size={28} />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <h1 className='text-primary-dark text-3xl font-bold md:text-4xl'>
                                {event.name}
                            </h1>
                            {isPastDeadline && (
                                <div className='flex items-center gap-2'>
                                    <FaCheckCircle
                                        size={16}
                                        className='text-dark-green'
                                    />
                                    <span className='text-dark-green text-sm font-semibold uppercase'>
                                        Zakończony
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {event.description && (
                        <p className='text-grey text-base font-medium md:text-lg'>
                            {event.description}
                        </p>
                    )}

                    {/* Deadline info */}
                    <div className='flex items-center gap-3 pt-2'>
                        <FaClock size={18} className='text-grey' />
                        <div className='flex flex-col gap-1'>
                            <p className='text-grey text-xs font-semibold uppercase'>
                                {txt.events.deadline}
                            </p>
                            <p
                                className={`text-sm font-semibold ${
                                    isPastDeadline
                                        ? 'text-dark-red'
                                        : 'text-primary-dark'
                                }`}
                            >
                                {deadline.toLocaleDateString('pl-PL')}{' '}
                                {deadline.toLocaleTimeString('pl-PL', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right side: Edit button */}
                <AdminOnly>
                    <ActionButton
                        label={txt.forms.edit}
                        onClick={editEvent}
                        className='w-full md:w-auto'
                    />
                </AdminOnly>
            </div>
        </div>
    );
}

// TODO BE + FE add question types for float (e.g. 3seconds, 34.5 meters)
// TODO BE + FE handle publishing of event
// TODO BE + FE total points
// TODO BE refresh token
// TODO distinguish current user in rankning (unique username)
// TODO search bar disabled instead of label
// TODO dropdown disabled colors
// TODO add seperate sections for active/past events (+ different text for buttons)
// TODO change date format (like polish one)
// TODO fix style in search bar of answer for "athlete" question
// TODO fix disciplines dropdown + search action
// TODO add dash instead of 0 when no points for answer
// TODO hide possibility to answer if editing as admin
// TODO events param active = true
// TODO mobile view of navbar
// TODO test plan
// TODO kiedy ranking pusty dodaj info ze nie ma jeszcze nic
