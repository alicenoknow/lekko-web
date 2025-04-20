import { PaginationInfo } from "./pagination";

export interface Answer {
    id: number;
    question_id: number;
    user_id?: number;
    content: { [key: string]: any } | null;
    points?: number;
    created_at?: string;
    updated_at?: string;
}

export type AnswersResponse = {
    data: Answer[];
    pagination: PaginationInfo;
};

export type CreateAnswerResponse = Answer;

export type UpdateAnswerResponse = Answer;