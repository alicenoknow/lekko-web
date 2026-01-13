export interface PaginationInfo {
    count: number;
    current_page: number;
    is_first_page: boolean;
    is_last_page: boolean;
    is_out_of_range_page: boolean;
    next_page: number | null;
    prev_page: number | null;
    total_count: number;
    total_pages: number;
}
