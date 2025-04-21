import {
    AnswerContent,
    AnswersParams,
    AnswersResponse,
    CreateAnswerResponse,
    UpdateAnswerResponse,
} from '@/types/answers';
import axios from 'axios';
import { getAuthConfig, handleError, isApiError } from './common';

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

export async function createAnswer(
    token: string,
    question_id: number,
    user_id: number,
    content: AnswerContent
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
    question_id: number,
    user_id: number,
    content: AnswerContent
): Promise<UpdateAnswerResponse> {
    const res = await axios.put(
        `${API_URL}/api/v1/users/me/answers/${id}`,
        { content, question_id, user_id },
        getAuthConfig(token)
    );
    if (isApiError(res.data)) throw handleError(res.data);
    return res.data;
}
