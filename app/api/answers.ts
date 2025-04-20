import { AnswersResponse } from '@/types/answers';
import axios from 'axios';
import { getAuthConfig, handleError, isApiError } from './common';

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

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
