import { Disciplines } from '@/types/disciplines';
import axios from 'axios';
import { getAuthConfig, isApiError, handleError } from './common';

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export async function fetchDisciplines(token: string): Promise<Disciplines> {
    const res = await axios.get(`${API_URL}/api/v1/disciplines?per_page=1000`, {
        // fetch all no paging
        ...getAuthConfig(token),
    });
    if (isApiError(res.data)) throw handleError(res.data);
    return res.data;
}
