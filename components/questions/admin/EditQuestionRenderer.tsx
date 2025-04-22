import {
    Question,
    AthleteQuestion,
    AthleteRankingQuestion,
    CountryQuestion,
    CountryRankingQuestion,
} from '@/types/questions';
import { AnswerContentMap } from '@/types/answers';

import EditAthleteQuestion from './EditAthleteQuestion';
import EditAthleteRankingQuestion from './EditAthleteRankingQuestion';
import EditCountryQuestion from './EditCountryQuestion';
import EditCountryRankingQuestion from './EditCountryRankingQuestion';

import { useCallback, useMemo, useState } from 'react';
import EditQuestionHeader from './common/EditQuestionHeader';
import QuestionFooterButtons from './common/QuestionFooterButtons';

interface Props {
    question: Question;
    onSubmit: (question: Question) => void;
    onDelete: (questionId: number) => void;
}

export default function EditQuestionRenderer({
    question,
    onSubmit,
    onDelete,
}: Props) {
    const [content, setContent] = useState(question.content);
    const [points, setPoints] = useState(question.points);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isFormInvalid = useMemo(
        () => !content.trim() || points < 1,
        [content, points]
    );

    const [correctAnswerPayload, setCorrectAnswerPayload] =
        useState<AnswerContentMap[typeof question.type]>();

    const handleSubmit = useCallback(() => {
        if (isFormInvalid) return;
        setIsSubmitting(true);
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        onSubmit({
            ...question,
            content: content.trim(),
            points,
            correct_answer: correctAnswerPayload,
        } as Question);
        setIsSubmitting(false);
    }, [
        question,
        content,
        points,
        correctAnswerPayload,
        onSubmit,
        isFormInvalid,
    ]);

    const handleDelete = useCallback(() => {
        setIsSubmitting(true);
        onDelete(question.id);
        setIsSubmitting(false);
    }, [onDelete, question.id]);

    const sharedProps = { onAnswerChanged: setCorrectAnswerPayload };

    const renderQuestionComponent = () => {
        switch (question.type) {
            case 'athlete':
                return (
                    <EditAthleteQuestion
                        question={question as AthleteQuestion}
                        {...sharedProps}
                    />
                );
            case 'athletes_three':
                return (
                    <EditAthleteRankingQuestion
                        question={question as AthleteRankingQuestion}
                        {...sharedProps}
                    />
                );
            case 'country':
                return (
                    <EditCountryQuestion
                        question={question as CountryQuestion}
                        {...sharedProps}
                    />
                );
            case 'countries_three':
                return (
                    <EditCountryRankingQuestion
                        question={question as CountryRankingQuestion}
                        {...sharedProps}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className='relative flex w-full flex-col pr-4 pt-4'>
            <EditQuestionHeader
                content={content}
                points={points}
                onContentChange={setContent}
                onPointsChange={setPoints}
            />
            {renderQuestionComponent()}
            <QuestionFooterButtons
                disableSubmit={isFormInvalid}
                isLoading={isSubmitting}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
            />
        </div>
    );
}
