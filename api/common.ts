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
