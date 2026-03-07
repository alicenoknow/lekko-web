'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import QuestionHeader from './common/QuestionHeader';
import QuestionFooterButtons from './common/QuestionFooterButtons';
import AthleteQuestion from './AthleteQuestion';
import AthleteRankingQuestion from './AthleteRankingQuestion';
import CountryQuestion from './CountryQuestion';
import CountryRankingQuestion from './CountryRankingQuestion';
import NumericValueQuestion from './NumericValueQuestion';

import {
    Answer,
    AnswerContent,
    AthleteAnswer,
    AthleteRankingAnswer,
    CountryAnswer,
    CountryRankingAnswer,
    NumericValueAnswer,
} from '@/types/answers';

import { Question } from '@/types/questions';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { useAnswerSubmit } from '@/hooks/useAnswerSubmit';

interface Props {
    question: Question;
    answer: Answer | undefined;
    isPastDeadline: boolean;
    onEdit?: () => void;
    onSaveSuccess?: () => void;
}

export default function QuestionRenderer({
    question,
    answer,
    isPastDeadline,
    onEdit,
    onSaveSuccess,
}: Props) {
    const { token } = useAuthenticatedUser();
    const [isModified, setIsModified] = useState(false);
    const [answerPayload, setAnswerPayload] = useState<AnswerContent | null>(
        null
    );
    const { onSubmit } = useAnswerSubmit(token, setIsModified);

    useEffect(() => {
        if (answer?.content) {
            setAnswerPayload(answer.content);
        }
    }, [answer?.content]);

    const handleSubmit = useCallback(() => {
        if (!answerPayload) return;
        onSubmit({
            id: answer?.id ?? Date.now() * -1,
            question_id: question.id,
            content: answerPayload,
        });
        onSaveSuccess?.();
    }, [answerPayload, onSubmit, answer?.id, question.id, onSaveSuccess]);

    const handleAnswerChanged = useCallback((content: AnswerContent) => {
        setAnswerPayload(content);
        setIsModified(true);
    }, []);

    const renderQuestionComponent = useMemo(() => {
        const sharedProps = {
            isPastDeadline,
            onAnswerChanged: handleAnswerChanged,
        };

        switch (question.type) {
            case 'athlete':
                return (
                    <AthleteQuestion
                        question={question}
                        answer={answer as AthleteAnswer}
                        {...sharedProps}
                    />
                );
            case 'athletes_three':
                return (
                    <AthleteRankingQuestion
                        question={question}
                        answer={answer as AthleteRankingAnswer}
                        {...sharedProps}
                    />
                );
            case 'country':
                return (
                    <CountryQuestion
                        question={question}
                        answer={answer as CountryAnswer}
                        {...sharedProps}
                    />
                );
            case 'countries_three':
                return (
                    <CountryRankingQuestion
                        question={question}
                        answer={answer as CountryRankingAnswer}
                        {...sharedProps}
                    />
                );
            case 'numeric_value':
                return (
                    <NumericValueQuestion
                        question={question}
                        answer={answer as NumericValueAnswer}
                        {...sharedProps}
                    />
                );
            default:
                return null;
        }
    }, [question, answer, isPastDeadline, handleAnswerChanged]);

    return (
        <div className='border-light-gray w-full rounded-xl border bg-white shadow-sm'>
            <div className='border-light-gray border-b px-6 py-6 md:px-8 md:py-8'>
                <QuestionHeader
                    content={question.content}
                    maxPoints={question.points}
                    points={
                        answer?.points_granted_at ? answer.points : undefined
                    }
                    {...(onEdit !== undefined ? { adminView: true } : {})}
                />
            </div>
            <div>
                <div className='px-6 py-6 md:px-8 md:py-8'>
                    {renderQuestionComponent}
                </div>
                <div className='border-light-gray border-t px-6 py-4 md:px-8 md:py-6'>
                    <QuestionFooterButtons
                        isSubmitting={false}
                        isModified={isModified}
                        isPastDeadline={isPastDeadline}
                        onSubmit={handleSubmit}
                        {...(onEdit !== undefined ? { onEdit } : {})}
                    />
                </div>
            </div>
        </div>
    );
}
