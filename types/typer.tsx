export interface TyperEvent {
    eventId: string;
    name: string;
    finalDate: Date;
}

export interface Discipline {
    disciplineId: string;
    name: string;
}

type QuestionType = 'RANK' | 'VALUE';

export interface Question {
    questionId: string;
    questionType: QuestionType;
    eventId: string;
    question: string;
    answer: AnswerDetails;
    maxPoints: number | null;
    disciplineId: string | null;
}

export interface Answer {
    answerId: string;
    questionId: string;
    userId: string;
    points: number | null;
    answer: AnswerDetails;
}

export type AnswerDetails = RankAnswer | ValueAnswer;

export interface RankAnswer {
    type: 'RANK';
    answer: readonly Athlete[];
}

export interface ValueAnswer {
    type: 'VALUE';
    answer: string;
}

export interface Athlete {
    athleteId: string;
    name: string;
}

export interface AthleteDetails {
    athleteId: string;
    name: string;
    disciplineId: string;
}
