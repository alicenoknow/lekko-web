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
    token: string,
    page: number = 1
): Promise<AxiosResponse<EventsResponse, AuthConfig>> {
    try {
        return await axios.get(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/events?page=${page}`,
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

export type EventDetailResponse = EventDetail | ApiErrorType;

export interface EventDetail {
    id: number;
    name: string;
    description?: string;
    deadline: string;
}

export async function getEventById(
    token: string,
    id: string | number
): Promise<AxiosResponse<EventDetailResponse, AuthConfig>> {
    try {
        return await axios.get(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/events/${id}`,
            getAuthConfig(token)
        );
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error);
            return Promise.reject(error.response || error);
        } else {
            console.error('Unknown error:', error);
            return Promise.reject(error);
        }
    }
}

export interface Questions {
    data: Question[];
    pagination_info: PaginationInfo;
}

export type QuestionsResponse = Questions | ApiErrorType;

export interface Question {
    id: number;
    content: string;
    type: string;
    points: number;
    correct_answer?: any;
    answers?: any[];
}

export async function getQuestionsFromEvent(
    token: string,
    id: string | number
): Promise<AxiosResponse<QuestionsResponse, AuthConfig>> {
    try {
        return await axios.get(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/questions?event_id=${id}`,
            getAuthConfig(token)
        );
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error);
            return Promise.reject(error.response || error);
        } else {
            console.error('Unknown error:', error);
            return Promise.reject(error);
        }
    }
}

export type CreateEventData = {
    created_at: string;
    deadline: string;
    description: string | null;
    id: number;
    name: string;
    updated_at: string;
};
export type CreateEventResponse = CreateEventData | ApiErrorType;

export async function createEvent(
    name: string,
    deadline: string,
    description: string | null,
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

type DeleteEventResponse = {};

export async function deleteEvent(
    eventId: number,
    token: string
): Promise<AxiosResponse<DeleteEventResponse, AuthConfig>> {
    try {
        return await axios.delete(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/events/${eventId}`,
            getAuthConfig(token)
        );
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error(
                'Axios error:',
                error.response?.data || error.message
            );
            return Promise.reject(error.response || error);
        } else {
            console.error('Unknown error:', error);
            return Promise.reject(error);
        }
    }
}

type AnswersResponse = {};

export async function getUserAnswers(
    eventId: number,
    token: string
): Promise<AxiosResponse<DeleteEventResponse, AuthConfig>> {
    try {
        return await axios.delete(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/events/${eventId}`,
            getAuthConfig(token)
        );
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error(
                'Axios error:',
                error.response?.data || error.message
            );
            return Promise.reject(error.response || error);
        } else {
            console.error('Unknown error:', error);
            return Promise.reject(error);
        }
    }
}

export type Athlete = {
    id: number;
    first_name: string | null;
    last_name: string | null;
    country: string | null;
};

export interface Athletes {
    data: Athlete[];
    pagination_info: PaginationInfo;
}

export type AthletesResponse = Athletes | ApiErrorType;

export async function getAthletes(
    search: string,
    token: string
): Promise<AxiosResponse<AthletesResponse>> {
    try {
        return await axios.get(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/athletes?search=${search}`,
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
