'use client';

import { useState } from 'react';
import { Question, Answer } from '@/app/api/typer';
import { txt } from '@/nls/texts';
import AthleteSearchBar from '@/components/forms/AthleteSearchBar';
import AthleteLabel from '../forms/AthleteLabel';
import Points from './Points';
import { ActionButton } from '../buttons';

interface Props {
    question: Question;
    onSubmit: (answer: Answer) => void;
}

export default function AthleteQuestion({ question, onSubmit }: Props) {
    const answer: Answer = {
        id: 1,
        question_id: 2,
        content: {},
    };
    const [selectedAthleteId, setSelectedAthleteId] = useState<number | null>(
        answer?.content?.athlete?.athlete_id || null
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isFormInvalid = !selectedAthleteId;

    const handleSubmit = () => {
        if (isFormInvalid) return;
        setIsSubmitting(true);
        onSubmit({
            user_id: 0, // TODO
            question_id: question.id,
            content: {
                athlete: {
                    athlete_id: selectedAthleteId,
                },
            },
        });
        setIsSubmitting(false);
    };

    // TODO block answering after deadline
    return (
        <div className='flex w-full flex-col bg-white p-8'>
            <div className='flex flex-row justify-between'>
                <div className='my-4 text-sm font-bold uppercase text-primaryDark md:text-lg'>
                    {question.content}
                </div>
                <Points
                    maxPoints={question.points}
                    grantedPoints={answer.points}
                />
            </div>
            <>
                <p className='my-4 text-sm font-bold uppercase text-primaryDark md:text-lg'>
                    {txt.forms.yourAnswer}:
                </p>
                <AthleteSearchBar
                    selected={selectedAthleteId}
                    onSelect={setSelectedAthleteId}
                />
            </>
            {question.correct_answer ? (
                <div>
                    <p className='my-4 text-sm font-bold uppercase text-primaryDark md:text-lg'>
                        {txt.forms.correctAnswer}:
                    </p>
                    <AthleteLabel
                        selected={question.correct_answer.athlete.athlete_id}
                    />
                </div>
            ) : (
                <ActionButton
                    loading={isSubmitting}
                    label={txt.forms.save}
                    onClick={handleSubmit}
                />
            )}
        </div>
    );
}
