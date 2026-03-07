export interface User {
    sub: number;
    roles: string[];
    exp: number;
    iat?: number;
    username: string;
}

export interface UserApiResponse {
    id: number;
    email: string;
    username: string;
    roles: string[];
    created_at: string;
    updated_at: string;
}

export interface PaginatedUserResponse {
    data: UserApiResponse[];
    total_count: number;
    page: number;
    limit: number;
}

export type CreateUserPayload = {
    email: string;
    username: string;
    password: string;
    roles?: { id?: number; name: string }[];
};

export type UpdateUserPayload = {
    email?: string;
    username?: string;
    password?: string;
};

export interface UserRankingResponse {
    place?: number | null;
    total_places?: number;
    total_points_scored?: number;
    total_points?: number;
    position?: number;
    user_id?: number;
    username?: string;
}
