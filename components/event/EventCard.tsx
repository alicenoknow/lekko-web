import { FaEdit, FaEye, FaEyeSlash } from 'react-icons/fa';
import { TiDelete } from 'react-icons/ti';
import { MdEmojiEvents } from 'react-icons/md';
import { FaClock } from 'react-icons/fa';
import ActionIcon from '@/components/buttons/ActionIcon';
import { AdminOnly } from '@/components/auth/AdminOnly';
import { TyperEvent } from '@/types/events';
import { txt } from '@/nls/texts';
import React from 'react';
import ActionButton from '../buttons/ActionButton';

interface Props {
    event: TyperEvent;
    onEdit: () => void;
    onAdminEdit: () => void;
    onDelete: () => void;
    onToggleStatus: () => void;
    isDeleting: boolean;
    isTogglingStatus: boolean;
}

function EventCard({
    event,
    onEdit,
    onAdminEdit,
    onDelete,
    onToggleStatus,
    isDeleting,
    isTogglingStatus,
}: Props) {
    const isPastDeadline = new Date(event.deadline) < new Date();
    const deadline = new Date(event.deadline);

    return (
        <div className='group border-light-gray flex flex-col gap-4 rounded-xl border bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md md:flex-row md:items-center md:justify-between'>
            {/* Icon and content */}
            <div className='flex flex-1 items-start gap-4'>
                <div className='bg-blue-accent text-primary-dark flex-shrink-0 rounded-lg p-3'>
                    <MdEmojiEvents size={24} />
                </div>
                <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-2'>
                        <h2 className='text-primary-dark text-lg font-bold md:text-xl'>
                            {event.name}
                        </h2>
                        {event.status === 'draft' && (
                            <span className='rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700'>
                                {txt.events.draft}
                            </span>
                        )}
                    </div>
                    {event.description && (
                        <p className='text-grey text-sm md:text-base'>
                            {event.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Deadline info */}
            <div className='flex items-center gap-3'>
                <FaClock
                    size={16}
                    className={isPastDeadline ? 'text-dark-red' : 'text-grey'}
                />
                <div className='flex flex-col'>
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
                        {deadline.toLocaleDateString('pl-PL')}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className='flex items-center gap-2 md:pl-4'>
                <AdminOnly
                    fallback={
                        <ActionButton
                            label={txt.events.open}
                            onClick={onEdit}
                        />
                    }
                >
                    {null}
                </AdminOnly>
                <AdminOnly>
                    <ActionIcon
                        label={<FaEdit size={20} />}
                        onClick={onAdminEdit}
                    />
                </AdminOnly>
                <AdminOnly>
                    <ActionIcon
                        label={<TiDelete size={20} />}
                        onClick={onDelete}
                        loading={isDeleting}
                        disabled={isDeleting}
                        variant='danger'
                    />
                </AdminOnly>
                <AdminOnly>
                    <ActionIcon
                        label={
                            event.status === 'draft' ? (
                                <FaEye size={20} />
                            ) : (
                                <FaEyeSlash size={20} />
                            )
                        }
                        onClick={onToggleStatus}
                        loading={isTogglingStatus}
                        disabled={isTogglingStatus}
                    />
                </AdminOnly>
            </div>
        </div>
    );
}

export default React.memo(EventCard);
