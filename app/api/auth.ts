import axios from 'axios';
import { EmptyResponse, handleError, isApiError } from './common';
import { ApiErrorType } from '@/types/errors';

type RegisterData = EmptyResponse;
type RegisterResponse = RegisterData | ApiErrorType;

export async function registerUser(
    email: string,
    username: string,
    password: string
): Promise<RegisterData> {
    const res = await axios.post<RegisterResponse>(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/register`,
        {
            email,
            username,
            password,
        }
    );
    if (isApiError(res.data)) {
        const err = handleError(res.data);
        throw err;
    }
    return res.data;
}

export type LoginData = { token: string };
type LoginResponse = LoginData | ApiErrorType;

export async function loginUser(
    email: string,
    password: string
): Promise<LoginData> {
    const res = await axios.post<LoginResponse>(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/login`,
        { email, password }
    );
    if (isApiError(res.data)) {
        const err = handleError(res.data);
        throw err;
    }
    return res.data;
}
