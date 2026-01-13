import { PaginationInfo } from './pagination';

export interface Answer {
    id: number;
    question_id: number;
    user_id?: number;
    points?: number;
    created_at?: string;
    updated_at?: string;
    content: AnswerContent | null;
}

export interface AthleteAnswer extends Answer {
    content: AthleteAnswerContent | null;
}

export interface AthleteRankingAnswer extends Answer {
    content: AthleteRankingAnswerContent | null;
}

export interface CountryAnswer extends Answer {
    content: CountryAnswerContent | null;
}

export interface CountryRankingAnswer extends Answer {
    content: CountryRankingAnswerContent | null;
}

export type AnswersParams = {
    question_ids?: string;
};

export type AnswersResponse = {
    data: Answer[];
    pagination: PaginationInfo;
};

export type CreateAnswerResponse = Answer;

export type UpdateAnswerResponse = Answer;

export interface AthleteAnswerContent {
    athlete_id: number | null;
}

export interface AthleteRankingAnswerContent {
    athlete_id_one: number | null;
    athlete_id_two: number | null;
    athlete_id_three: number | null;
}

export interface CountryAnswerContent {
    country: string | null;
}

export interface CountryRankingAnswerContent {
    country_one: string | null;
    country_two: string | null;
    country_three: string | null;
}

export type AnswerContentMap = {
    athlete: AthleteAnswerContent;
    athletes_three: AthleteRankingAnswerContent;
    country: CountryAnswerContent;
    countries_three: CountryRankingAnswerContent;
};

export type AnswerContentByType<T extends keyof AnswerContentMap> =
    AnswerContentMap[T];

export type AnswerContent = AnswerContentMap[keyof AnswerContentMap];
