'use client';

import { useState, useEffect } from 'react';
import { txt } from '@/nls/texts';
import AthleteSearchBar from '@/components/forms/AthleteSearchBar';
import AthleteLabel from '../forms/AthleteLabel';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import { isAdmin } from '@/lib/admin';
import CorrectAnswer from './common/CorrectAnswer';
import { AthleteAnswer, AthleteAnswerContent } from '@/types/answers';
import { AthleteQuestion as AthleteQuestionType } from '@/types/questions';

interface Props {
    question: AthleteQuestionType;
    answer: AthleteAnswer | undefined;
    isPastDeadline: boolean;
    onAnswerChanged: (content: AthleteAnswerContent) => void;
}

export default function AthleteQuestion({
    question,
    answer,
    isPastDeadline,
    onAnswerChanged,
}: Props) {
    const { user } = usePrivateUserContext();
    const [selectedId, setSelectedId] = useState<number | null>(
        answer?.content?.athlete_id ?? null
    );

    useEffect(() => {
        if (selectedId !== null) {
            onAnswerChanged({ athlete_id: selectedId });
        }
    }, [selectedId, onAnswerChanged]);

    const showCorrectAnswer = isPastDeadline || isAdmin(user);
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

            {showCorrectAnswer && question.correct_answer && (
                <CorrectAnswer>
                    <AthleteLabel
                        selected={question.correct_answer.athlete_id}
                    />
                </CorrectAnswer>
            )}
        </>
    );
}
