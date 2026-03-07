import axios from 'axios';
import { getAuthConfig, isApiError, handleError } from './common';
import { Ranking } from '@/types/ranking';

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export async function fetchRanking(
    token: string,
    page: number = 1,
    eventId?: number
): Promise<Ranking> {
    const res = await axios.get(`${API_URL}/api/v1/ranking`, {
        ...getAuthConfig(token),
        params: {
            page_no: page,
            ...(eventId !== undefined ? { event_id: eventId } : {}),
        },
    });
    if (isApiError(res.data)) throw handleError(res.data);
    return res.data;
}
