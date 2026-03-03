'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import QuestionHeader from './common/QuestionHeader';
import QuestionFooterButtons from './common/QuestionFooterButtons';
import AthleteQuestion from './AthleteQuestion';
import AthleteRankingQuestion from './AthleteRankingQuestion';
import CountryQuestion from './CountryQuestion';
import CountryRankingQuestion from './CountryRankingQuestion';

import {
    Answer,
    AnswerContent,
    AthleteAnswer,
    AthleteRankingAnswer,
    CountryAnswer,
    CountryRankingAnswer,
} from '@/types/answers';

import { Question } from '@/types/questions';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { useAnswerSubmit } from '@/hooks/useAnswerSubmit';

interface Props {
    question: Question;
    answer: Answer | undefined;
    isPastDeadline: boolean;
    onEdit?: () => void;
}

export default function QuestionRenderer({
    question,
    answer,
    isPastDeadline,
    onEdit,
}: Props) {
    const { token, user } = useAuthenticatedUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModified, setIsModified] = useState(false);
    const [answerPayload, setAnswerPayload] = useState<AnswerContent | null>(
        null
    );
    const { onSubmit } = useAnswerSubmit(token, user.sub, setIsModified);

    useEffect(() => {
        if (answer?.content) {
            setAnswerPayload(answer.content);
        }
    }, [answer?.content]);

    const handleSubmit = useCallback(() => {
        if (!answerPayload) return;
        setIsSubmitting(true);
        onSubmit({
            id: answer?.id ?? Date.now() * -1,
            question_id: question.id,
            content: answerPayload,
        });
        setIsSubmitting(false);
    }, [answerPayload, onSubmit, answer?.id, question.id]);

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
            default:
                return null;
        }
    }, [question, answer, isPastDeadline, handleAnswerChanged]);

    return (
        <div className='border-light-gray w-full overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 hover:shadow-md'>
            <div className='border-light-gray border-b px-6 py-6 md:px-8 md:py-8'>
                <QuestionHeader
                    content={question.content}
                    maxPoints={question.points}
                    points={
                        answer?.points_granted_at ? answer.points : undefined
                    }
                />
            </div>
            <div className='px-6 py-6 md:px-8 md:py-8'>
                {renderQuestionComponent}
            </div>
            <div className='border-light-gray border-t px-6 py-4 md:px-8 md:py-6'>
                <QuestionFooterButtons
                    isSubmitting={isSubmitting}
                    isModified={isModified}
                    isPastDeadline={isPastDeadline}
                    onSubmit={handleSubmit}
                    {...(onEdit !== undefined ? { onEdit } : {})}
                />
            </div>
        </div>
    );
}
