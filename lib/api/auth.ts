import axios from 'axios';
import {
    EmptyResponse,
    getAuthConfig,
    handleError,
    isApiError,
} from './common';
import { ApiErrorType } from '@/types/errors';

type RegisterData = { message: string };
type RegisterResponse = RegisterData | ApiErrorType;

export async function registerUser(
    email: string,
    username: string,
    password: string
): Promise<RegisterData> {
    const res = await axios.post<RegisterResponse>(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/register/request-verification`,
        {
            email,
            username,
            password,
        }
    );
    if (isApiError(res.data)) throw handleError(res.data);
    return res.data;
}

export type LoginData = {
    access_token: string;
    refresh_token: string;
    expires_in: number;
};
type LoginResponse = LoginData | ApiErrorType;

export async function loginUser(
    email: string,
    password: string
): Promise<LoginData> {
    const res = await axios.post<LoginResponse>(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/login`,
        { email, password }
    );
    if (isApiError(res.data)) throw handleError(res.data);
    return res.data;
}

export async function refreshAccessToken(
    refreshToken: string
): Promise<LoginData> {
    const res = await axios.post<LoginResponse>(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/refresh`,
        { refresh_token: refreshToken }
    );
    if (isApiError(res.data)) throw handleError(res.data);
    return res.data;
}

export async function verifyEmail(token: string): Promise<LoginData> {
    const res = await axios.post<LoginResponse>(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/verify-email`,
        { token }
    );
    if (isApiError(res.data)) throw handleError(res.data);
    return res.data;
}

export async function logoutUser(authToken: string): Promise<EmptyResponse> {
    const res = await axios.post<EmptyResponse | ApiErrorType>(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/logout`,
        undefined,
        getAuthConfig(authToken)
    );
    if (isApiError(res.data)) throw handleError(res.data);
    return res.data as EmptyResponse;
}
