import { PaginationInfo } from "./pagination";

interface UserRank {
    username: string;
    total_points: number;
}

export interface Ranking {
    data: UserRank[];
    pagination_info: PaginationInfo;
}