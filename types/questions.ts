import { EmptyResponse } from "@/app/api/common";
import { PaginationInfo } from "./pagination";
import { AthleteAnswerContent, AthleteRankingAnswerContent, CountryAnswerContent, CountryRankingAnswerContent } from "./answers";

export interface Questions {
    data: Question[];
    pagination_info: PaginationInfo;
}

interface BaseQuestion {
    id: number;
    content: string;
    points: number;
    event_id?: number;
    created_at?: string;
    updated_at?: string;
}

export interface AthleteQuestion extends BaseQuestion {
    type: 'athlete';
    correct_answer?: AthleteAnswerContent;
}

export interface AthleteRankingQuestion extends BaseQuestion {
    type: 'athletes_three';
    correct_answer?: AthleteRankingAnswerContent;
}

export interface CountryQuestion extends BaseQuestion {
    type: 'country';
    correct_answer?: CountryAnswerContent;
}

export interface CountryRankingQuestion extends BaseQuestion {
    type: 'countries_three';
    correct_answer?: CountryRankingAnswerContent;
}

export type Question =
    | AthleteQuestion
    | AthleteRankingQuestion
    | CountryQuestion
    | CountryRankingQuestion;

export type QuestionType = Question['type'];

export type CreateQuestionResponse = Question;

export type UpdateQuestionResponse = Question;

export type DeleteQuestionResponse = EmptyResponse;

