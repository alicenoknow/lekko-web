import { EmptyResponse } from '@/lib/api/common';
import {
    Answer,
    AnswerContent,
    AthleteAnswerContent,
    AthleteRankingAnswerContent,
    CountryAnswerContent,
    CountryRankingAnswerContent,
} from './answers';

export interface Questions {
    data: Question[];
    total_count: number;
    page: number;
    limit: number;
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

export interface NumericValueQuestion extends BaseQuestion {
    type: 'numeric_value';
    correct_answer?: { value: number | null };
}

export type Question =
    | AthleteQuestion
    | AthleteRankingQuestion
    | CountryQuestion
    | CountryRankingQuestion
    | NumericValueQuestion;

export type QuestionType = Question['type'];

/** Shared props interface for all view-mode question components. */
export interface QuestionComponentProps {
    question: Question;
    answer: Answer | undefined;
    isPastDeadline: boolean;
    onAnswerChanged: (content: AnswerContent) => void;
}

/** Shared props interface for all admin edit-mode question components. */
export interface EditQuestionComponentProps {
    question: Question;
    onAnswerChanged: (content: AnswerContent) => void;
}

export type CreateQuestionResponse = Question;

export type UpdateQuestionResponse = Question;

export type DeleteQuestionResponse = EmptyResponse;
