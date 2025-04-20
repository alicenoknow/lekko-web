import { txt } from '@/nls/texts';
import { EventDetail } from '@/types/events';
import ActionButton from '../buttons/ActionButton';
import { AdminOnly } from '../auth/AdminOnly';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export default function EventHeader({ event }: { event: EventDetail }) {
    const router = useRouter();

    const editEvent = useCallback(() => {
        router.replace(`/typer/event/${event.id}/admin`);
    }, [event, router]);

    return (
        <div className='m-auto mt-12 flex flex-row justify-between'>
            <div className='space-y-2'>
                <h1 className='text-3xl font-bold'>{event.name}</h1>
                {event.description && <p>{event.description}</p>}
                <p className='text-sm text-gray-600'>
                    {txt.events.deadline}: {event.deadline}
                </p>
            </div>
            <AdminOnly>
                <ActionButton label={txt.forms.edit} onClick={editEvent} />
            </AdminOnly>
        </div>
    );
}
