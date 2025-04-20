'use client';

import { useCallback, useState } from 'react';
import QuestionHeader from './common/QuestionHeader';
import QuestionFooterButtons from './common/QuestionFooterButtons';
import AthleteQuestion from './AthleteQuestion';
import AthleteRankingQuestion from './AthleteRankingQuestion';
import CountryQuestion from './CountryQuestion';
import CountryRankingQuestion from './CountryRankingQuestion';
import { Answer } from '@/types/answers';
import { Question } from '@/types/questions';

interface Props {
    question: Question;
    answer: Answer | undefined;
    isPastDeadline: boolean;
    onSubmit: (answer: Answer) => void;
    onEdit?: () => void;
}

export default function QuestionRenderer({
    question,
    answer,
    isPastDeadline,
    onSubmit,
    onEdit,
}: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModified, setIsModified] = useState(false);
    const [answerPayload, setAnswerPayload] = useState<
        Answer['content'] | undefined
    >(answer?.content);

    const handleSubmit = useCallback(() => {
        if (!answerPayload) return;
        setIsSubmitting(true);
        onSubmit({
            id: answer?.id ?? Date.now() * -1,
            question_id: question.id,
            content: answerPayload,
        });
        setIsSubmitting(false);
        setIsModified(false);
    }, [answerPayload, onSubmit, answer?.id, question.id]);

    const handleAnswerChanged = useCallback((content: Answer['content']) => {
        setAnswerPayload(content);
        setIsModified(true);
    }, []);

    const renderQuestionComponent = () => {
        const sharedProps = {
            question,
            answer,
            isPastDeadline,
            onAnswerChanged: handleAnswerChanged,
        };

        switch (question.type) {
            case 'athlete':
                return <AthleteQuestion {...sharedProps} />;
            case 'athletes_three':
                return <AthleteRankingQuestion {...sharedProps} />;
            case 'country':
                return <CountryQuestion {...sharedProps} />;
            case 'countries_three':
                return <CountryRankingQuestion {...sharedProps} />;
            default:
                return null;
        }
    };

    return (
        <div className='flex w-full flex-col bg-white p-8'>
            <QuestionHeader
                content={question.content}
                maxPoints={question.points}
                points={answer?.points}
            />
            {renderQuestionComponent()}
            <QuestionFooterButtons
                isSubmitting={isSubmitting}
                isModified={isModified}
                isPastDeadline={isPastDeadline}
                onSubmit={handleSubmit}
                onEdit={onEdit}
            />
        </div>
    );
}
