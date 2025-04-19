'use client';

import { useState } from 'react';
import { Question } from '@/app/api/typer';
import QuestionFooterButtons from './QuestionFooterButtons';
import FormField from '@/components/forms/FormField';
import { txt } from '@/nls/texts';
import AthleteSearchBar from '@/components/forms/AthleteSearchBar';

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

    const isFormInvalid = !content.trim() || points < 1;

    const handleSubmit = () => {
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
    };

    const handleDelete = () => {
        setIsSubmitting(true);
        onDelete(question.id);
        setIsSubmitting(false);
    };

    return (
        <div className='relative flex w-full flex-col pr-4 pt-4'>
            <FormField
                label={txt.questions.content}
                id='question-content'
                type='text'
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                multiline
            />
            <FormField
                label={txt.questions.points}
                id='question-points'
                type='number'
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                required
            />
            {question.id > 0 && (
                <>
                    <p className='my-4 text-sm font-bold uppercase text-primaryDark md:text-lg'>
                        {txt.forms.correctAnswer}:
                    </p>
                    <AthleteSearchBar
                        selected={selectedAthleteId}
                        onSelect={setSelectedAthleteId}
                    />
                </>
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
