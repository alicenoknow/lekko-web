export interface UserRank {
    position: number;
    user_id: number;
    username: string;
    total_points: number;
}

export interface Ranking {
    data: UserRank[];
    total_count: number;
    page: number;
    limit: number;
}
