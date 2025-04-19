'use client';

import { useState, useCallback } from 'react';
import { Question, Answer } from '@/app/api/typer';
import { txt } from '@/nls/texts';
import AthleteSearchBar from '@/components/forms/AthleteSearchBar';
import AthleteLabel from '../forms/AthleteLabel';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import { isAdmin } from '@/lib/Admin';
import CorrectAnswer from './common/CorrectAnswer';
import QuestionFooterButtons from './common/QuestionFooterButtons';
import QuestionHeader from './common/QuestionHeader';

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
    const answer: Answer = {
        id: 1,
        question_id: 2,
        content: {},
    };
    const { user } = usePrivateUserContext();

    const [selectedAthleteId, setSelectedAthleteId] = useState<number | null>(
        answer.content.athlete_id ?? null
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModified, setIsModified] = useState(false);

    const isFormInvalid = !selectedAthleteId;

    const handleSelectAthlete = useCallback((athleteId: number | null) => {
        setSelectedAthleteId(athleteId);
        setIsModified(true);
    }, []);

    const handleSubmit = useCallback(() => {
        if (isFormInvalid) return;

        setIsSubmitting(true);
        onSubmit({
            user_id: user.sub,
            question_id: question.id,
            content: { athlete_id: selectedAthleteId },
        });
        setIsSubmitting(false);
        setIsModified(false);
    }, [isFormInvalid, onSubmit, question.id, selectedAthleteId, user.sub]);

    const showCorrectAnswer =
        question.correct_answer && (isPastDeadline || isAdmin(user));

    return (
        <>
            <QuestionHeader
                content={question.content}
                maxPoints={question.points}
                points={answer.points}
            />
            {isPastDeadline ? (
                <AthleteLabel
                    label={txt.forms.yourAnswer}
                    selected={selectedAthleteId}
                />
            ) : (
                <AthleteSearchBar
                    selected={selectedAthleteId}
                    onSelect={handleSelectAthlete}
                    label={txt.forms.yourAnswer}
                />
            )}
            {showCorrectAnswer && (
                <CorrectAnswer>
                    <AthleteLabel
                        selected={question.correct_answer.athlete_id}
                    />
                </CorrectAnswer>
            )}
            <QuestionFooterButtons
                isSubmitting={isSubmitting}
                isModified={isModified}
                isPastDeadline={isPastDeadline}
                onSubmit={handleSubmit}
                onEdit={onEdit}
            />
        </>
    );
}
