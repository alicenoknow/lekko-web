import { FaEdit } from 'react-icons/fa';
import { TiDelete } from 'react-icons/ti';
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
    isDeleting: boolean;
}

function EventCard({
    event,
    onEdit,
    onAdminEdit,
    onDelete,
    isDeleting,
}: Props) {
    return (
        <div className='flex flex-col rounded-md border bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between'>
            <div className='flex flex-col text-left'>
                <h2 className='font-semibold md:text-xl'>{event.name}</h2>
                {event.description && (
                    <p className='mt-1 text-primaryDark'>{event.description}</p>
                )}
                <p className='mt-2 text-sm'>
                    {txt.events.deadline}:{' '}
                    {new Date(event.deadline).toLocaleString()}
                </p>
            </div>
            <div className='mt-4 flex items-center gap-4 md:ml-6 md:mt-0'>
                <ActionButton label={txt.events.open} onClick={onEdit} />
                <AdminOnly>
                    <ActionIcon
                        label={<FaEdit size={30} />}
                        onClick={onAdminEdit}
                    />
                </AdminOnly>
                <AdminOnly>
                    <ActionIcon
                        label={<TiDelete size={30} />}
                        onClick={onDelete}
                        loading={isDeleting}
                        disabled={isDeleting}
                    />
                </AdminOnly>
            </div>
        </div>
    );
}

export default React.memo(EventCard);
