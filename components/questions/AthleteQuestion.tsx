'use client';

import { useEffect, useState } from 'react';
import { txt } from '@/nls/texts';
import AthleteSearchBar from '@/components/forms/AthleteSearchBar';
import AthleteLabel from '../forms/AthleteLabel';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
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
    const { user } = useAuthenticatedUser();
    const [selectedId, setSelectedId] = useState<number | null>(null);

    useEffect(() => {
        if (answer?.content?.athlete_id !== undefined) {
            setSelectedId(answer.content.athlete_id);
        }
    }, [answer?.content?.athlete_id]);

    useEffect(() => {
        if (selectedId !== null && selectedId !== answer?.content?.athlete_id) {
            onAnswerChanged({ athlete_id: selectedId });
        }
    }, [selectedId, answer?.content?.athlete_id, onAnswerChanged]);

    const admin = isAdmin(user);
    const isResolved = !!question.correct_answer;
    const isLocked = isPastDeadline || isResolved;
    const hasAnswer = !!answer?.content?.athlete_id;
    const showCorrectAnswer = admin || isLocked;

    return (
        <div className='flex flex-col gap-6'>
            {!admin &&
                (isLocked ? (
                    hasAnswer ? (
                        <AthleteLabel
                            label={txt.forms.yourAnswer}
                            selected={selectedId}
                        />
                    ) : (
                        <p className='text-grey text-sm'>
                            {txt.questions.resolved}
                        </p>
                    )
                ) : (
                    <AthleteSearchBar
                        label={txt.forms.yourAnswer}
                        selected={selectedId}
                        onSelect={setSelectedId}
                        showSelectedBelow
                    />
                ))}
            {showCorrectAnswer && question.correct_answer?.athlete_id && (
                <CorrectAnswer
                    maxPoints={admin ? undefined : question.points}
                    grantedPoints={admin ? undefined : answer?.points}
                >
                    <AthleteLabel
                        selected={question.correct_answer.athlete_id}
                    />
                </CorrectAnswer>
            )}
            {admin && !question.correct_answer && (
                <p className='text-grey text-sm'>{txt.questions.noCorrectAnswer}</p>
            )}
        </div>
    );
}
