import axios, { AxiosResponse } from 'axios';
import { ApiErrorType } from './errors';

export type RegisterData = {};
export type RegisterResponse = {} | ApiErrorType;

export async function registerUser(
    email: string,
    username: string,
    password: string
): Promise<AxiosResponse<RegisterResponse>> {
    try {
        return await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/register`,
            {
                email,
                username,
                password,
            }
        );
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error);
        } else {
            console.error('Unknown error:', error);
        }
        return Promise.reject(error);
    }
}

export type LoginData = { token: string };
export type LoginResponse = LoginData | ApiErrorType;

export async function loginUser(
    email: string,
    password: string
): Promise<AxiosResponse<LoginResponse>> {
    try {
        const response = await axios.post<LoginResponse>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/login`,
            { email, password }
        );

        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error(
                'Axios error:',
                error.response?.data || error.message
            );
            return Promise.reject(error.response || error);
        } else {
            console.error('Unexpected error:', error);
            return Promise.reject(error);
        }
    }
}
