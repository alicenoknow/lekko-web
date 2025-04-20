export enum ErrorType {
    BadRequest = 'bad_request',
    LoginError = 'login_error',
    AuthError = 'auth_error',
    InternalServerError = 'internal_server_error',
}

export enum ValidationErrorType {
    ValidationError = 'validation_error',
}

export enum ValidationErrorDetailsType {
    Required = 'required',
    Email = 'email',
    Gte = 'gte',
    Lte = 'lte',
    Min = 'min',
    Len = 'len',
    Max = 'max',
    IdOf = 'id_of',
    Eq = 'eq',
    OneOf = 'one_of',
}

interface ValidationErrorDetails {
    error_type: ValidationErrorDetailsType;
    details: string;
    path: readonly string[];
}

export interface ValidationApiError {
    error_type: ValidationErrorType;
    details: readonly ValidationErrorDetails[];
}

export interface ApiError {
    error_type: ErrorType;
    details: string;
}

export type ApiErrorType = ApiError | ValidationApiError;