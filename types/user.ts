export interface User {
    sub: number;
    roles: string[];
    exp: number;
    iat?: number;
    username: string;
}
