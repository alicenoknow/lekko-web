import { isSuccess } from '@/app/api/common';
import { ApiErrorType, handleError } from '@/app/api/errors';
import { EventsData, getEvents } from '@/app/api/typer';
import nookies from 'nookies';

export default async function Typer() {
    let events: EventsData | null = null;
    let errorMessage: string | null = null;

    try {
        const token = nookies.get(null, 'accessToken');
        const response = await getEvents(JSON.stringify(token));
        if (isSuccess<EventsData>(response)) {
            events = response.data;
        } else {
            const error = response.data as ApiErrorType;
            errorMessage = handleError(error);
        }
    } catch (err) {
        console.warn(err);
        errorMessage = handleError();
    }

    return <>{events}</>;
}
