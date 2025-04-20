import { PaginationInfo } from "./pagination";

export type Athlete = {
    id: number;
    first_name: string | null;
    last_name: string | null;
    country: string | null;
};

export interface Athletes {
    data: Athlete[];
    pagination_info: PaginationInfo;
}