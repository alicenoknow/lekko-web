import {
    CreateQuestionResponse,
    DeleteQuestionResponse,
    Questions,
    UpdateQuestionResponse,
} from '@/types/questions';
import axios from 'axios';
import { getAuthConfig, handleError, isApiError } from './common';

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export async function fetchQuestionsFromEvent(
    token: string,
    id: string | number,
    page: number = 1
): Promise<Questions> {
    const res = await axios.get(
        `${API_URL}/api/v1/questions?event_id=${id}&page_no=${page}`,
        getAuthConfig(token)
    );
    if (isApiError(res.data)) throw handleError(res.data);
    return res.data;
}

export async function createQuestion(
    token: string,
    event_id: number,
    type: string,
    content: string,
    points: number
): Promise<CreateQuestionResponse> {
    const res = await axios.post(
        `${API_URL}/api/v1/questions`,
        { event_id, type, content, points },
        getAuthConfig(token)
    );
    if (isApiError(res.data)) throw handleError(res.data);
    return res.data;
}

export async function updateQuestion(
    token: string,
    id: number,
    event_id: number,
    type: string,
    content?: string,
    points?: number,
    correct_answer?: any
): Promise<UpdateQuestionResponse> {
    const res = await axios.put(
        `${API_URL}/api/v1/questions/${id}`,
        { content, type, event_id, points, correct_answer },
        getAuthConfig(token)
    );
    if (isApiError(res.data)) throw handleError(res.data);
    return res.data;
}

export async function deleteQuestion(
    token: string,
    id: number
): Promise<DeleteQuestionResponse> {
    const res = await axios.delete(
        `${API_URL}/api/v1/questions/${id}`,
        getAuthConfig(token)
    );
    if (isApiError(res.data)) throw handleError(res.data);
    return res.data;
}
