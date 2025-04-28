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

// TODO BE + FE add question types for float (e.g. 3seconds, 34.5 meters)
// TODO BE + FE handle publishing of event
// TODO BE + FE total points
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
//
