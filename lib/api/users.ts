import axios from 'axios';
import {
    getAuthConfig,
    handleError,
    isApiError,
    EmptyResponse,
} from './common';
import {
    CreateUserPayload,
    PaginatedUserResponse,
    UpdateUserPayload,
    UserApiResponse,
    UserRankingResponse,
} from '@/types/user';

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export async function fetchUsers(
    token: string,
    page = 1
): Promise<PaginatedUserResponse> {
    const res = await axios.get(`${API_URL}/api/v1/users`, {
        ...getAuthConfig(token),
        params: { page_no: page },
    });
    if (isApiError(res.data)) throw handleError(res.data);
    return res.data;
}

export async function createUser(
    token: string,
    payload: CreateUserPayload
): Promise<UserApiResponse> {
    const res = await axios.post(
        `${API_URL}/api/v1/users`,
        payload,
        getAuthConfig(token)
    );
    if (isApiError(res.data)) throw handleError(res.data);
    return res.data;
}

export async function fetchCurrentUser(
    token: string
): Promise<UserApiResponse> {
    const res = await axios.get(
        `${API_URL}/api/v1/users/me`,
        getAuthConfig(token)
    );
    if (isApiError(res.data)) throw handleError(res.data);
    return res.data;
}

export async function fetchUserById(
    token: string,
    id: number
): Promise<UserApiResponse> {
    const res = await axios.get(
        `${API_URL}/api/v1/users/${id}`,
        getAuthConfig(token)
    );
    if (isApiError(res.data)) throw handleError(res.data);
    return res.data;
}

export async function updateUser(
    token: string,
    id: number,
    payload: UpdateUserPayload
): Promise<UserApiResponse> {
    const res = await axios.put(
        `${API_URL}/api/v1/users/${id}`,
        payload,
        getAuthConfig(token)
    );
    if (isApiError(res.data)) throw handleError(res.data);
    return res.data;
}

export async function deleteUser(
    token: string,
    id: number
): Promise<EmptyResponse> {
    const res = await axios.delete(
        `${API_URL}/api/v1/users/${id}`,
        getAuthConfig(token)
    );
    if (isApiError(res.data)) throw handleError(res.data);
    return res.data;
}

export async function fetchCurrentUserRanking(
    token: string,
    eventId?: number
): Promise<UserRankingResponse> {
    const res = await axios.get(`${API_URL}/api/v1/users/me/ranking`, {
        ...getAuthConfig(token),
        params: eventId !== undefined ? { event_id: eventId } : undefined,
    });
    if (isApiError(res.data)) throw handleError(res.data);
    return res.data;
}
