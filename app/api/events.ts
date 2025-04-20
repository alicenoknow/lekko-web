import axios from 'axios';
import { getAuthConfig, handleError, isApiError } from './common';
import {
    CreateEventResponse,
    DeleteEventResponse,
    EventDetail,
    EventsData,
    UpdateEventResponse,
} from '@/types/events';

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export async function fetchEvents(
    token: string,
    page = 1
): Promise<EventsData> {
    const res = await axios.get(
        `${API_URL}/api/v1/events?page=${page}`,
        getAuthConfig(token)
    );
    if (isApiError(res.data)) {
        const err = handleError(res.data);
        throw err;
    }
    return res.data;
}

export async function fetchEventById(
    token: string,
    id: string | number
): Promise<EventDetail> {
    const res = await axios.get(
        `${API_URL}/api/v1/events/${id}`,
        getAuthConfig(token)
    );
    if (isApiError(res.data)) {
        const err = handleError(res.data);
        throw err;
    }
    return res.data;
}

export async function createEvent(
    name: string,
    deadline: string,
    description: string | null,
    token: string
): Promise<CreateEventResponse> {
    const res = await axios.post(
        `${API_URL}/api/v1/events`,
        { name, deadline, description },
        getAuthConfig(token)
    );
    if (isApiError(res.data)) {
        const err = handleError(res.data);
        throw err;
    }
    return res.data;
}

export async function updateEvent(
    eventId: number,
    token: string,
    name?: string,
    description?: string,
    deadline?: string
): Promise<UpdateEventResponse> {
    const res = await axios.put(
        `${API_URL}/api/v1/events/${eventId}`,
        {
            name,
            description,
            deadline,
        },
        getAuthConfig(token)
    );
    if (isApiError(res.data)) {
        const err = handleError(res.data);
        throw err;
    }
    return res.data;
}

export async function deleteEvent(
    eventId: number,
    token: string
): Promise<DeleteEventResponse> {
    const res = await axios.delete(
        `${API_URL}/api/v1/events/${eventId}`,
        getAuthConfig(token)
    );
    if (isApiError(res.data)) {
        const err = handleError(res.data);
        throw err;
    }
    return res.data;
}
