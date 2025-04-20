import { txt } from '@/nls/texts';
import { EventDetail } from '@/types/events';

export default function EventHeader({ event }: { event: EventDetail }) {
    return (
        <div className='space-y-2'>
            <h1 className='text-3xl font-bold'>{event.name}</h1>
            {event.description && <p>{event.description}</p>}
            <p className='text-sm text-gray-600'>
                {txt.events.deadline}: {event.deadline}
            </p>
        </div>
    );
}
