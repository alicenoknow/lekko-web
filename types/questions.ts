import { EmptyResponse } from "@/app/api/common";
import { PaginationInfo } from "./pagination";

export interface Questions {
    data: Question[];
    pagination_info: PaginationInfo;
}

export interface Question {
    id: number;
    content: string;
    type: string;
    points: number;
    event_id?: number;
    correct_answer?: any;
    answers?: any[];
    created_at?: string;
    updated_at?: string;
}

export type CreateQuestionResponse = Question;

export type UpdateQuestionResponse = Question;

export type DeleteQuestionResponse = EmptyResponse;

