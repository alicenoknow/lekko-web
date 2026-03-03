export interface Discipline {
    id: number;
    name: string;
    type: string;
}

export interface Disciplines {
    data: Discipline[];
    total_count: number;
    page: number;
    limit: number;
}
