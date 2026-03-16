import { PaginationInfo } from '@/types/pagination';

export interface UserRank {
    position: number;
    user_id: number;
    username: string;
    total_points: number;
}

export interface Ranking {
    data: UserRank[];
    pagination_info: PaginationInfo;
}

export interface NormalizedUserRanking {
    place: number | null;
    totalPoints: number | null;
}
