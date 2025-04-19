import axios from 'axios';
import { handleError, isApiError } from './errors';
import { getAuthConfig } from './common';
import qs from 'qs';

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

export interface Question {
    id: number;
    content: string;
    type: string;
    points: number;
    event_id?: number;
    correct_answer?: any;
    answers?: any[];
    created_at?: string;
    updated_at?: string;
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

type AnswersResponse = {
    data: Answer[];
    pagination: PaginationInfo;
};

export async function fetchUserAnswers(
    eventId: number,
    token: string
): Promise<AnswersResponse> {
    const res = await axios.get(
        `${API_URL}/api/v1/users/me/answers?event_id=${eventId}`,
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

export async function fetchAthleteById(
    id: number,
    token: string
): Promise<Athlete> {
    const res = await axios.get(
        `${API_URL}/api/v1/athletes/${id}`,
        getAuthConfig(token)
    );
    if (isApiError(res.data)) {
        const err = handleError(res.data);
        throw err;
    }
    return res.data;
}

export async function fetchAthletes(
    search: string,
    token: string,
    discipline_ids?: string[],
    country?: string | null,
    gender?: string | null,
    page = 1
): Promise<Athletes> {
    const params: Record<string, any> = {
        search,
        page,
    };

    if (discipline_ids && discipline_ids.length > 0) {
        params['discipline_ids'] = discipline_ids;
    }

    if (country) params.country = country;
    if (gender) params.gender = gender;

    const res = await axios.get(`${API_URL}/api/v1/athletes`, {
        ...getAuthConfig(token),
        params,
        paramsSerializer: (params) =>
            qs.stringify(params, { arrayFormat: 'repeat' }),
    });

    if (isApiError(res.data)) {
        const err = handleError(res.data);
        throw err;
    }
    return res.data;
}

type CreateQuestiontData = Question;

export async function createQuestion(
    token: string,
    event_id: number,
    type: string,
    content: string,
    points: number
): Promise<CreateQuestiontData> {
    const res = await axios.post(
        `${API_URL}/api/v1/questions`,
        { event_id, type, content, points },
        getAuthConfig(token)
    );
    if (isApiError(res.data)) {
        const err = handleError(res.data);
        throw err;
    }
    return res.data;
}

type ModifyQuestionData = Question;

export async function updateQuestion(
    token: string,
    id: number,
    event_id: number,
    type: string,
    content?: string,
    points?: number,
    correct_answer?: any
): Promise<ModifyQuestionData> {
    console.warn(content, type, event_id, points, correct_answer);

    const res = await axios.put(
        `${API_URL}/api/v1/questions/${id}`,
        { content, type, event_id, points, correct_answer },
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

export interface Discipline {
    id: number;
    name: string;
    type: string;
}

export interface Disciplines {
    data: Discipline[];
    pagination_info: PaginationInfo;
}

export async function fetchDisciplines(token: string): Promise<Disciplines> {
    const res = await axios.get(`${API_URL}/api/v1/disciplines?per_page=1000`, {
        // fetch all no paging
        ...getAuthConfig(token),
    });
    if (isApiError(res.data)) {
        const err = handleError(res.data);
        throw err;
    }
    return res.data;
}

export interface Answer {
    id?: number;
    question_id: number;
    user_id?: number;
    content: { [key: string]: any };
    points?: number;
    created_at?: string;
    updated_at?: string;
}
