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
        <div className='m-auto mt-6 flex flex-row items-center justify-between'>
            <div className='flex flex-col items-start space-y-2'>
                <h1 className='text-3xl font-bold'>{event.name}</h1>
                {event.description && <p>{event.description}</p>}
                <p className='text-sm text-primaryDark'>
                    {txt.events.deadline}:{' '}
                    {new Date(event.deadline).toLocaleString()}
                </p>
            </div>
            <AdminOnly>
                <ActionButton label={txt.forms.edit} onClick={editEvent} />
            </AdminOnly>
        </div>
    );
}

// TODO colors
// TODO banner
// TODO pills
// TODO close search bar
// TODO hide correct answer on question create
// TODO delete confirmation
// TODO red background for invalid answer
// TODO (backend also) add question types for float (e.g. 3seconds, 34.5 meters)
// TODO logout on navbar + better placement of nav items
// TODO handle publishing of event
// TODO change edit button to sth like "Odpowiedz!"
// TODO flags edit ranking athlete center
// TODO save button after error
// TODO BE total points
