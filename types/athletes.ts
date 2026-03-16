import { PaginationInfo } from '@/types/pagination';

export type Athlete = {
    id: number;
    first_name: string | null;
    last_name: string | null;
    gender: string;
    country: string | null;
    disciplines: string[];
};

export interface Athletes {
    data: Athlete[];
    pagination_info: PaginationInfo;
}

export type AthletesParams = {
    search: string;
    page_no?: number;
    discipline_ids?: string;
    country?: string;
    gender?: string;
    order_by?: string;
    order_dir?: string;
};
