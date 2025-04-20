'use client';

import { useState, useEffect } from 'react';
import { txt } from '@/nls/texts';
import AthleteSearchBar from '@/components/forms/AthleteSearchBar';
import AthleteLabel from '../forms/AthleteLabel';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import { isAdmin } from '@/lib/admin';
import CorrectAnswer from './common/CorrectAnswer';
import { Answer } from '@/types/answers';
import { Question } from '@/types/questions';

interface Props {
    question: Question;
    answer: Answer;
    isPastDeadline: boolean;
    onAnswerChanged: (content: Answer['content']) => void;
}

export default function AthleteQuestion({
    question,
    answer,
    isPastDeadline,
    onAnswerChanged,
}: Props) {
    const { user } = usePrivateUserContext();
    const [selectedId, setSelectedId] = useState<number | null>(
        answer.content?.athlete_id ?? null
    );

    useEffect(() => {
        if (selectedId !== null) {
            onAnswerChanged({ athlete_id: selectedId });
        }
    }, [selectedId, onAnswerChanged]);

    const showCorrectAnswer =
        question.correct_answer && (isPastDeadline || isAdmin(user));

    return (
        <>
            {isPastDeadline ? (
                <AthleteLabel
                    label={txt.forms.yourAnswer}
                    selected={selectedId}
                />
            ) : (
                <AthleteSearchBar
                    label={txt.forms.yourAnswer}
                    selected={selectedId}
                    onSelect={setSelectedId}
                />
            )}

            {showCorrectAnswer && (
                <CorrectAnswer>
                    <AthleteLabel
                        selected={question.correct_answer.athlete_id}
                    />
                </CorrectAnswer>
            )}
        </>
    );
}
