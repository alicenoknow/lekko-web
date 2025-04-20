import { PaginationInfo } from "./pagination";

export interface Discipline {
    id: number;
    name: string;
    type: string;
}

export interface Disciplines {
    data: Discipline[];
    pagination_info: PaginationInfo;
}
