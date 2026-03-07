import {
    Answer,
    AnswerContent,
    AnswersParams,
    AnswersResponse,
    CreateAnswerResponse,
    UpdateAnswerResponse,
} from '@/types/answers';
import axios from 'axios';
import {
    EmptyResponse,
    getAuthConfig,
    handleError,
    isApiError,
} from './common';

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export async function fetchAnswers(
    token: string,
    question_ids: number[]
): Promise<AnswersResponse> {
    const params: AnswersParams = {};
    if (question_ids && question_ids.length > 0) {
        params['question_ids'] = question_ids.join(',');
    }
    const res = await axios.get(`${API_URL}/api/v1/users/me/answers`, {
        ...getAuthConfig(token),
        params,
    });
    if (isApiError(res.data)) throw handleError(res.data);
    return res.data;
}

export async function fetchMyAnswerById(
    token: string,
    id: number
): Promise<Answer> {
    const res = await axios.get(
        `${API_URL}/api/v1/users/me/answers/${id}`,
        getAuthConfig(token)
    );
    if (isApiError(res.data)) throw handleError(res.data);
    return res.data;
}

export async function createAnswer(
    token: string,
    question_id: number,
    content: AnswerContent,
    user_id: number
): Promise<CreateAnswerResponse> {
    const res = await axios.post(
        `${API_URL}/api/v1/users/me/answers`,
        { content, question_id, user_id },
        getAuthConfig(token)
    );
    if (isApiError(res.data)) throw handleError(res.data);
    return res.data;
}

export async function updateAnswer(
    token: string,
    id: number,
    content: AnswerContent,
    question_id: number,
    user_id: number
): Promise<UpdateAnswerResponse> {
    const res = await axios.put(
        `${API_URL}/api/v1/users/me/answers/${id}`,
        { content, question_id, user_id },
        getAuthConfig(token)
    );
    if (isApiError(res.data)) throw handleError(res.data);
    return res.data;
}

export async function deleteAnswer(
    token: string,
    id: number
): Promise<EmptyResponse> {
    const res = await axios.delete(
        `${API_URL}/api/v1/users/me/answers/${id}`,
        getAuthConfig(token)
    );
    if (isApiError(res.data)) throw handleError(res.data);
    return res.data;
}

export async function fetchAllAnswers(
    token: string,
    params?: {
        question_ids?: number[];
        event_id?: number;
        user_id?: number;
        page?: number;
    }
): Promise<AnswersResponse> {
    const queryParams: Record<string, string | number | undefined> = {};
    if (params?.question_ids && params.question_ids.length > 0) {
        queryParams['question_ids'] = params.question_ids.join(',');
    }
    if (params?.event_id !== undefined)
        queryParams['event_id'] = params.event_id;
    if (params?.user_id !== undefined) queryParams['user_id'] = params.user_id;
    if (params?.page !== undefined) queryParams['page_no'] = params.page;

    const res = await axios.get(`${API_URL}/api/v1/answers`, {
        ...getAuthConfig(token),
        params: queryParams,
    });
    if (isApiError(res.data)) throw handleError(res.data);
    return res.data;
}

export async function fetchAnswerById(
    token: string,
    id: number
): Promise<Answer> {
    const res = await axios.get(
        `${API_URL}/api/v1/answers/${id}`,
        getAuthConfig(token)
    );
    if (isApiError(res.data)) throw handleError(res.data);
    return res.data;
}
