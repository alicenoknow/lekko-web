import { Athlete, Athletes, AthletesParams } from '@/types/athletes';
import axios from 'axios';
import { getAuthConfig, handleError, isApiError } from './common';

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export async function fetchAthleteById(
    id: number,
    token: string
): Promise<Athlete> {
    const res = await axios.get(
        `${API_URL}/api/v1/athletes/${id}`,
        getAuthConfig(token)
    );
    if (isApiError(res.data)) throw handleError(res.data);
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
    const params: AthletesParams = {
        search,
        page_no: page,
    };

    if (discipline_ids && discipline_ids.length > 0) {
        params['discipline_ids'] = discipline_ids.join(',');
    }
    if (country) params.country = country;
    if (gender) params.gender = gender;
    params.order_by = 'last_name';

    const res = await axios.get(`${API_URL}/api/v1/athletes`, {
        ...getAuthConfig(token),
        params,
    });

    if (isApiError(res.data)) throw handleError(res.data);
    return res.data;
}
