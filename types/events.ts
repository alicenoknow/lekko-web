import { EmptyResponse } from '@/lib/api/common';
import { PaginationInfo } from '@/types/pagination';

export interface EventsData {
    data: readonly TyperEvent[];
    pagination_info: PaginationInfo;
}

export interface TyperEvent {
    created_at: string;
    deadline: string;
    description: null | string;
    id: number;
    name: string;
    status: 'draft' | 'published';
    updated_at: string;
}

export interface EventDetail {
    id: number;
    name: string;
    description?: string;
    deadline: string;
    status: 'draft' | 'published';
}

export type CreateEventResponse = {
    created_at: string;
    deadline: string;
    description: string | null;
    id: number;
    name: string;
    status: 'draft' | 'published';
    updated_at: string;
};

export type UpdateEventResponse = CreateEventResponse;

export type DeleteEventResponse = EmptyResponse;
