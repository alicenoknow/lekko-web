import axios from 'axios';
import { handleError } from './errors';

export async function registerUser(
    email: string,
    password: string
): Promise<string> {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/register`,
            {
                email,
                password,
            }
        );
        if (response.status != 200) {
            return handleError(response.data);
        }
        return '';
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error);
        } else {
            console.error('Unknown error:', error);
        }
        return handleError();
    }
}
