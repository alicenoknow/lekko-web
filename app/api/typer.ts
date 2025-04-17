import axios from 'axios';
import { ApiErrorType, handleError, isApiError } from './errors';
import { getAuthConfig } from './common';
import { type } from 'os';

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export interface EventsData {
    data: readonly TyperEvent[];
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

export type EventDetailResponse = EventDetail | ApiErrorType;

export interface EventDetail {
    id: number;
    name: string;
    description?: string;
    deadline: string;
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

export async function fetchQuestionsFromEvent(
    token: string,
    id: string | number,
    page: number = 1
): Promise<Questions> {
    const res = await axios.get(
        `${API_URL}/api/v1/questions?event_id=${id}&page=${page}`,
        getAuthConfig(token)
    );
    if (isApiError(res.data)) {
        const err = handleError(res.data);
        throw err;
    }
    return res.data;
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
): Promise<CreateEventData> {
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

type UpdateEventResponse = {};

export async function updateEvent(
    eventId: string,
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

type DeleteEventResponse = {};

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

type AnswersResponse = {};

export async function fetchUserAnswers(
    eventId: string,
    token: string
): Promise<AnswersResponse> {
    const res = await axios.get(
        `${API_URL}/api/v1/answers?event_id=${eventId}`,
        getAuthConfig(token)
    );
    if (isApiError(res.data)) {
        const err = handleError(res.data);
        throw err;
    }
    return res.data;
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

export async function fetchAthletes(
    search: string,
    token: string,
    page = 1
): Promise<Athletes> {
    const res = await axios.get(`${API_URL}/api/v1/athletes`, {
        ...getAuthConfig(token),
        params: { search, page },
    });
    if (isApiError(res.data)) {
        const err = handleError(res.data);
        throw err;
    }
    return res.data;
}

type CreateQuestiontData = {};

export async function createQuestion(
    token: string,
    event_id?: string,
    type?: string,
    content?: string,
    points?: number,
    correct_answer?: any
): Promise<CreateQuestiontData> {
    const res = await axios.post(
        `${API_URL}/api/v1/questions`,
        { event_id, type, content, points, correct_answer },
        getAuthConfig(token)
    );
    if (isApiError(res.data)) {
        const err = handleError(res.data);
        throw err;
    }
    return res.data;
}

type ModifyQuestionData = {};

export async function updateQuestion(
    token: string,
    id: number,
    content?: string,
    points?: number,
    correct_answer?: any
): Promise<ModifyQuestionData> {
    const res = await axios.put(
        `${API_URL}/api/v1/questions/${id}`,
        { content, points, correct_answer },
        getAuthConfig(token)
    );
    if (isApiError(res.data)) {
        const err = handleError(res.data);
        throw err;
    }
    return res.data;
}

type DeleteQuestionData = {};

export async function deleteQuestion(
    token: string,
    id: number
): Promise<DeleteQuestionData> {
    const res = await axios.delete(
        `${API_URL}/api/v1/questions/${id}`,
        getAuthConfig(token)
    );
    if (isApiError(res.data)) {
        const err = handleError(res.data);
        throw err;
    }
    return res.data;
}
