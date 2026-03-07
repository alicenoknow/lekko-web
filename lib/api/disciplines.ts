import { Discipline, Disciplines } from '@/types/disciplines';
import axios from 'axios';
import { getAuthConfig, isApiError, handleError } from './common';

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export async function fetchDisciplines(token: string): Promise<Disciplines> {
    const res = await axios.get(`${API_URL}/api/v1/disciplines`, {
        // fetch all no paging
        ...getAuthConfig(token),
        params: { per_page: 1000, order_by: 'name', order_dir: 'asc' },
    });
    if (isApiError(res.data)) throw handleError(res.data);
    return res.data;
}

export async function fetchDisciplineById(
    token: string,
    id: number
): Promise<Discipline> {
    const res = await axios.get(
        `${API_URL}/api/v1/disciplines/${id}`,
        getAuthConfig(token)
    );
    if (isApiError(res.data)) throw handleError(res.data);
    return res.data;
}
