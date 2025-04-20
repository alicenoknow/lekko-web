import {
    ValidationErrorDetailsType,
    ApiErrorType,
    ErrorType,
    ValidationErrorType,
    ValidationApiError,
    ApiError,
} from '@/types/errors';

export type EmptyResponse = Record<string, never>;

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

const GENERIC_ERROR_MESSAGE = 'Błąd. Spróbuj ponownie później.';
const GENERIC_VALIDATION_ERROR_MESSAGE = 'Wprowadzono niepoprawne dane.';
const EMAIL_ERROR_MESSAGE = 'Podany email jest niepoprawny.';
const REQUIRED_FIELDS_ERROR_MESSAGE = 'Wszystkie pola są wymagane.';
const BAD_REQUEST_ERROR_MESSAGE = 'Nieprawidłowe żądanie.';
const BAD_LOGIN_ERROR_MESSAGE = 'Błąd logowania.';
const BAD_AUTH_ERROR_MESSAGE = 'Błąd uwierzytelniania.';

export function handleError(
    data?: ValidationApiError | ApiError | null
): string {
    if (!data) {
        console.error('Empty error data.');
        return GENERIC_ERROR_MESSAGE;
    }
    switch (data?.error_type) {
        case ValidationErrorType.ValidationError:
            return handleValidationApiError(data as ValidationApiError);
        case ErrorType.BadRequest:
            return BAD_REQUEST_ERROR_MESSAGE;
        case ErrorType.LoginError:
            return BAD_LOGIN_ERROR_MESSAGE;
        case ErrorType.AuthError:
            return BAD_AUTH_ERROR_MESSAGE;
        case ErrorType.InternalServerError:
        default:
            return GENERIC_ERROR_MESSAGE;
    }
}

export function handleValidationApiError(error: ValidationApiError): string {
    console.error('Validation error:', error.error_type, error.details);
    for (const errorDetail of error.details) {
        switch (errorDetail.error_type) {
            case ValidationErrorDetailsType.Required:
                return REQUIRED_FIELDS_ERROR_MESSAGE;
            case ValidationErrorDetailsType.Email:
                return EMAIL_ERROR_MESSAGE;
        }
    }
    return GENERIC_VALIDATION_ERROR_MESSAGE;
}

export function isApiError(error: unknown): error is ApiErrorType {
    return typeof error === 'object' && error !== null && 'error_type' in error;
}
