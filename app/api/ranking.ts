import axios from 'axios';
import { getAuthConfig, isApiError, handleError } from './common';
import { Ranking } from '@/types/ranking';

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export async function fetchRankingFromEvent(
    token: string,
    id: string | null,
    page: number = 1
): Promise<Ranking> {
    let url = `${API_URL}/api/v1/ranking?page_no=${page}`;
    if (id) {
        url += `&event_id=${id}`;
    }
    const res = await axios.get(url, getAuthConfig(token));
    if (isApiError(res.data)) throw handleError(res.data);
    return res.data;
}
