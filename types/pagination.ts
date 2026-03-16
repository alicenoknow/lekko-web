export interface PaginationInfo {
    count: number;
    total_count: number;
    total_pages: number;
    current_page: number;
    next_page: number | null;
    prev_page: number | null;
    is_first_page: boolean;
    is_last_page: boolean;
    is_out_of_range_page: boolean;
}
