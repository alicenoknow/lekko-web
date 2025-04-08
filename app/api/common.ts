import { AxiosResponse } from 'axios';
import { ApiErrorType } from './errors';

export function isSuccess<T>(
    response: AxiosResponse<T | ApiErrorType>
): response is AxiosResponse<T> {
    if (response.status !== 200) {
        return false;
    }
    return true;
}

export type AuthConfig = {
    headers: {
        Authorization: string;
    };
};

export function getAuthConfig(token: string): AuthConfig {
    return {
        headers: { Authorization: `Bearer ${token}` },
    };
}
