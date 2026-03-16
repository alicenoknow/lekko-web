'use client';

import { Question, QuestionType, EditQuestionComponentProps } from '@/types/questions';
import { AnswerContent } from '@/types/answers';
import EditAthleteQuestion from './EditAthleteQuestion';
import EditAthleteRankingQuestion from './EditAthleteRankingQuestion';
import EditCountryQuestion from './EditCountryQuestion';
import EditCountryRankingQuestion from './EditCountryRankingQuestion';
import EditNumericValueQuestion from './EditNumericValueQuestion';
import { useCallback, useMemo, useState } from 'react';
import EditQuestionHeader from './common/EditQuestionHeader';
import QuestionFooterButtons from './common/QuestionFooterButtons';

const EDIT_QUESTION_COMPONENT_MAP = {
    athlete: EditAthleteQuestion,
    athletes_three: EditAthleteRankingQuestion,
    country: EditCountryQuestion,
    countries_three: EditCountryRankingQuestion,
    numeric_value: EditNumericValueQuestion,
} as Record<QuestionType, React.ComponentType<EditQuestionComponentProps>>;

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
        useState<AnswerContent>();

    const handleSubmit = useCallback(() => {
        if (isFormInvalid) return;
        setIsSubmitting(true);
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

    const EditComponent = EDIT_QUESTION_COMPONENT_MAP[question.type] ?? null;

    return (
        <div className='relative flex w-full flex-col pr-4 pt-4'>
            <EditQuestionHeader
                content={content}
                points={points}
                onContentChange={setContent}
                onPointsChange={setPoints}
            />
            {question.id >= 0 && EditComponent && (
                <EditComponent
                    question={question}
                    onAnswerChanged={setCorrectAnswerPayload}
                />
            )}
            <QuestionFooterButtons
                disableSubmit={isFormInvalid}
                isLoading={isSubmitting}
                isNew={question.id < 0}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
            />
        </div>
    );
}
