import {
    ValidationErrorDetailsType,
    ApiErrorType,
    ErrorType,
    ValidationErrorType,
    ValidationApiError,
    ApiError,
} from '@/types/errors';
import { logger } from '@/lib/logger';
import { txt } from '@/nls/texts';

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

export function handleError(
    data?: ValidationApiError | ApiError | null
): string {
    if (!data) {
        logger.error('Empty error data received from API');
        return txt.errors.generic;
    }
    switch (data?.error_type) {
        case ValidationErrorType.ValidationError:
            return handleValidationApiError(data as ValidationApiError);
        case ErrorType.BadRequest:
            return txt.errors.badRequest;
        case ErrorType.LoginError:
            return txt.errors.badLogin;
        case ErrorType.AuthError:
            return txt.errors.badAuth;
        case ErrorType.InternalServerError:
        default:
            return txt.errors.generic;
    }
}

export function handleValidationApiError(error: ValidationApiError): string {
    logger.error(`Validation error: ${error.error_type}`, error.details);
    for (const errorDetail of error.details) {
        switch (errorDetail.error_type) {
            case ValidationErrorDetailsType.Required:
                return txt.errors.requiredFields;
            case ValidationErrorDetailsType.Email:
                return txt.errors.email;
        }
    }
    return txt.errors.validation;
}

export function isApiError(error: unknown): error is ApiErrorType {
    return typeof error === 'object' && error !== null && 'error_type' in error;
}
