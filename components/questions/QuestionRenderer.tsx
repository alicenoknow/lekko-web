'use client';

import { useCallback, useState } from 'react';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import { isAdmin } from '@/lib/Admin';
import { Question, Answer } from '@/app/api/typer';
import QuestionHeader from './common/QuestionHeader';
import QuestionFooterButtons from './common/QuestionFooterButtons';
import AthleteQuestion from './AthleteQuestion';
import AthleteRankingQuestion from './AthleteRankingQuestion';
import CountryQuestion from './CountryQuestion';
import CountryRankingQuestion from './CountryRankingQuestion';

interface Props {
    question: Question;
    answer: Answer;
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
    const { user } = usePrivateUserContext();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModified, setIsModified] = useState(false);
    const [answerPayload, setAnswerPayload] = useState<Answer['content']>({});

    const handleSubmit = useCallback(() => {
        if (!answerPayload) return;
        setIsSubmitting(true);
        onSubmit({
            user_id: user.sub,
            question_id: question.id,
            content: answerPayload,
        });
        setIsSubmitting(false);
        setIsModified(false);
    }, [answerPayload, onSubmit, question.id, user.sub]);

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
                points={answer.points}
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
