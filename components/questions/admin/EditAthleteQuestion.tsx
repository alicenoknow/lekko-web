'use client';

import { useCallback, useMemo, useState } from 'react';
import { Question } from '@/app/api/typer';
import QuestionFooterButtons from './common/QuestionFooterButtons';
import AthleteSearchBar from '@/components/forms/AthleteSearchBar';
import EditQuestionHeader from './common/EditQuestionHeader';
import CorrectAnswer from '../common/CorrectAnswer';

interface Props {
    question: Question;
    onSubmit: (question: Question) => void;
    onDelete: (questionId: number) => void;
}

export default function EditAthleteQuestion({
    question,
    onSubmit,
    onDelete,
}: Props) {
    const [content, setContent] = useState(question.content);
    const [points, setPoints] = useState(question.points);
    const [selectedAthleteId, setSelectedAthleteId] = useState<number | null>(
        question?.correct_answer?.athlete_id || null
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isFormInvalid = useMemo(
        () => !content.trim() || points < 1,
        [content, points]
    );

    const handleSubmit = useCallback(() => {
        if (isFormInvalid) return;
        setIsSubmitting(true);
        onSubmit({
            ...question,
            content: content.trim(),
            points,
            ...(selectedAthleteId !== null && {
                correct_answer: { athlete_id: selectedAthleteId },
            }),
        });
        setIsSubmitting(false);
    }, [isFormInvalid, content, points, selectedAthleteId, question, onSubmit]);

    const handleDelete = useCallback(() => {
        setIsSubmitting(true);
        onDelete(question.id);
        setIsSubmitting(false);
    }, [onDelete, question.id]);

    return (
        <div className='relative flex w-full flex-col pr-4 pt-4'>
            <EditQuestionHeader
                content={content}
                points={points}
                onContentChange={setContent}
                onPointsChange={setPoints}
            />
            {question.id > 0 && (
                <CorrectAnswer>
                    <AthleteSearchBar
                        selected={selectedAthleteId}
                        onSelect={setSelectedAthleteId}
                    />
                </CorrectAnswer>
            )}
            <QuestionFooterButtons
                disableSubmit={isFormInvalid}
                isLoading={isSubmitting}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
            />
        </div>
    );
}
