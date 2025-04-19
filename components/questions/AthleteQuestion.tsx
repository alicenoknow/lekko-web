'use client';

import { useState } from 'react';
import { Question, Answer } from '@/app/api/typer';
import { txt } from '@/nls/texts';
import AthleteSearchBar from '@/components/forms/AthleteSearchBar';
import AthleteLabel from '../forms/AthleteLabel';
import Points from './Points';
import { ActionButton } from '../buttons';
import { AdminOnly } from '../auth/AdminOnly';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import { isAdmin } from '@/lib/Admin';

interface Props {
    question: Question;
    isPastDeadline: boolean;
    onSubmit: (answer: Answer) => void;
    onEdit?: () => void;
}

export default function AthleteQuestion({
    question,
    isPastDeadline,
    onSubmit,
    onEdit,
}: Props) {
    const { user } = usePrivateUserContext();

    const answer: Answer = {
        // TODO
        id: 1,
        question_id: 2,
        content: {},
    };
    const [selectedAthleteId, setSelectedAthleteId] = useState<number | null>(
        answer?.content?.athlete_id || null
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModified, setModified] = useState(false);

    const isFormInvalid = !selectedAthleteId;

    const handleSubmit = () => {
        if (isFormInvalid) return;
        setIsSubmitting(true);
        onSubmit({
            user_id: user.sub,
            question_id: question.id,
            content: {
                athlete_id: selectedAthleteId,
            },
        });
        setModified(false);
        setIsSubmitting(false);
    };

    const handleSelectAthlete = (athleteId: number | null) => {
        setSelectedAthleteId(athleteId);
        setModified(true);
    };

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
            {isPastDeadline ? (
                <AthleteLabel
                    label={txt.forms.yourAnswer}
                    selected={selectedAthleteId}
                />
            ) : (
                <AthleteSearchBar
                    label={txt.forms.yourAnswer}
                    selected={selectedAthleteId}
                    onSelect={handleSelectAthlete}
                />
            )}
            {question.correct_answer && (isPastDeadline || isAdmin(user)) && (
                <div className='mb-4 bg-lightGreen p-4'>
                    <AthleteLabel
                        label={txt.forms.correctAnswer}
                        selected={question.correct_answer.athlete_id}
                    />
                </div>
            )}
            <div className='flex flex-row justify-between'>
                <ActionButton
                    loading={isSubmitting}
                    label={
                        isModified && !isPastDeadline
                            ? txt.forms.save
                            : txt.forms.saved
                    }
                    onClick={handleSubmit}
                    disabled={!isModified || isPastDeadline}
                />
                <AdminOnly>
                    {onEdit && (
                        <ActionButton label={txt.forms.edit} onClick={onEdit} />
                    )}
                </AdminOnly>
            </div>
        </div>
    );
}
