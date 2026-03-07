import {
    FaTimesCircle,
    FaClock,
    FaEdit,
    FaEye,
    FaEyeSlash,
    FaPen,
    FaClipboardList,
    FaTrophy,
} from 'react-icons/fa';
import { MdLeaderboard } from 'react-icons/md';
import ActionIcon from '@/components/buttons/ActionIcon';
import { AdminOnly } from '@/components/auth/AdminOnly';
import { TyperEvent } from '@/types/events';
import { txt } from '@/nls/texts';
import React from 'react';

interface Props {
    event: TyperEvent;
    onEdit: () => void;
    onAdminEdit: () => void;
    onDelete: () => void;
    onToggleStatus: () => void;
    onGoToRanking: () => void;
    isDeleting: boolean;
    isTogglingStatus: boolean;
}

function EventCard({
    event,
    onEdit,
    onAdminEdit,
    onDelete,
    onToggleStatus,
    onGoToRanking,
    isDeleting,
    isTogglingStatus,
}: Props) {
    const isPastDeadline = new Date(event.deadline) < new Date();
    const deadline = new Date(event.deadline);
    const eventActionIconClass = 'p-3';

    return (
        <div className='group border-light-gray flex flex-col gap-4 rounded-xl border bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md md:flex-row md:items-center md:gap-6'>
            {/* Icon and content */}
            <div className='flex flex-1 items-center gap-4'>
                <div className='bg-blue-accent text-primary-dark flex-shrink-0 rounded-lg p-3'>
                    <FaTrophy size={36} />
                </div>
                <div className='flex flex-col items-start gap-2 text-left'>
                    <div className='flex items-center gap-2'>
                        <h2 className='text-primary-dark text-left text-lg font-bold md:text-xl'>
                            {event.name}
                        </h2>
                        {event.status === 'draft' && (
                            <span className='rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700'>
                                {txt.events.draft}
                            </span>
                        )}
                    </div>
                    {event.description && (
                        <p className='text-grey text-left text-sm md:text-base'>
                            {event.description}
                        </p>
                    )}
                </div>
            </div>

            <div className='flex items-center justify-between gap-4 md:justify-end'>
                {/* Deadline info */}
                <div className='flex items-center gap-3'>
                    <FaClock
                        size={16}
                        className={
                            isPastDeadline ? 'text-dark-red' : 'text-grey'
                        }
                    />
                    <p
                        className={`text-sm font-semibold uppercase ${
                            isPastDeadline ? 'text-dark-red' : 'text-grey'
                        }`}
                    >
                        {txt.events.deadline}:{' '}
                        {deadline.toLocaleDateString('pl-PL')}{' '}
                        {deadline.toLocaleTimeString('pl-PL', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </p>
                </div>

                {/* Actions */}
                <div className='flex shrink-0 items-center gap-2'>
                    <AdminOnly
                        fallback={
                            isPastDeadline ? (
                                <>
                                    <ActionIcon
                                        label={
                                            <FaClipboardList
                                                size={24}
                                                className='text-primary-light'
                                            />
                                        }
                                        onClick={onEdit}
                                        className={eventActionIconClass}
                                    />
                                    <ActionIcon
                                        label={
                                            <MdLeaderboard
                                                size={24}
                                                className='text-primary-light'
                                            />
                                        }
                                        onClick={onGoToRanking}
                                        className={eventActionIconClass}
                                    />
                                </>
                            ) : (
                                <ActionIcon
                                    label={
                                        <FaPen size={24} className='text-primary-light' />
                                    }
                                    onClick={onEdit}
                                    className={eventActionIconClass}
                                />
                            )
                        }
                    >
                        {null}

                        <ActionIcon
                            label={<FaEdit size={24} className='text-primary-light' />}
                            onClick={onAdminEdit}
                            className={eventActionIconClass}
                        />
                        <ActionIcon
                            label={
                                event.status === 'draft' ? (
                                    <FaEye size={24} className='text-primary-light' />
                                ) : (
                                    <FaEyeSlash size={24} className='text-primary-light' />
                                )
                            }
                            onClick={onToggleStatus}
                            loading={isTogglingStatus}
                            disabled={isTogglingStatus}
                            className={eventActionIconClass}
                        />
                        <ActionIcon
                            label={
                                <FaTimesCircle size={24} className='text-light-red' />
                            }
                            onClick={onDelete}
                            loading={isDeleting}
                            disabled={isDeleting}
                            variant='danger'
                            className={eventActionIconClass}
                        />
                    </AdminOnly>
                </div>
            </div>
        </div>
    );
}

export default React.memo(EventCard);
