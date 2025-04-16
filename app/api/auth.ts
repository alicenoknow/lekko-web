import axios, { AxiosResponse } from 'axios';
import { ApiErrorType, handleError, isApiError } from './errors';

export type RegisterData = {};
export type RegisterResponse = RegisterData | ApiErrorType;

export async function registerUser(
    email: string,
    username: string,
    password: string
): Promise<AxiosResponse<RegisterData>> {
    const res = await axios.post(
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
export type LoginResponse = LoginData | ApiErrorType;

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
