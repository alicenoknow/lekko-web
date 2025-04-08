import axios, { AxiosResponse } from 'axios';
import { ApiErrorType } from './errors';
import { AuthConfig, getAuthConfig } from './common';

export interface EventsData {
    data: ReadonlyArray<TyperEvent>;
    pagination_info: PaginationInfo;
}

export interface TyperEvent {
    created_at: string;
    deadline: string;
    description: null | string;
    id: number;
    name: string;
    updated_at: string;
}

export interface PaginationInfo {
    count: number;
    current_page: number;
    is_first_page: boolean;
    is_last_page: boolean;
    is_out_of_range_page: boolean;
    next_page: number | null;
    prev_page: number | null;
    total_count: number;
    total_pages: number;
}

export type EventsResponse = EventsData | ApiErrorType;

export async function getEvents(
    token: string
): Promise<AxiosResponse<EventsResponse, AuthConfig>> {
    try {
        console.log(getAuthConfig(token));
        return await axios.get(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/events`,
            getAuthConfig(token)
        );
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error);
        } else {
            console.error('Unknown error:', error);
        }
        return Promise.reject(error);
    }
}

export type CreateEventData = {
    created_at: string;
    deadline: string;
    description: null | string;
    id: number;
    name: string;
    updated_at: string;
};
export type CreateEventResponse = CreateEventData | ApiErrorType;

export async function createEvent(
    name: string,
    deadline: string,
    description: string,
    token: string
): Promise<AxiosResponse<CreateEventResponse, AuthConfig>> {
    try {
        return await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/events`,
            {
                name,
                deadline,
                description,
            },
            getAuthConfig(token)
        );
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error);
        } else {
            console.error('Unknown error:', error);
        }
        return Promise.reject(error);
    }
}
