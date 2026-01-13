'use client';

import { useCallback, useEffect, useState } from 'react';
import AthleteSearchBar from '../forms/AthleteSearchBar';
import AthleteLabel from '../forms/AthleteLabel';
import { RANKING, getAthleteRankingKey } from '@/lib/ranking';
import { txt } from '@/nls/texts';
import CorrectAnswer from './common/CorrectAnswer';
import { isAdmin } from '@/lib/admin';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import {
    AthleteRankingAnswer,
    AthleteRankingAnswerContent,
} from '@/types/answers';
import { AthleteRankingQuestion as AthleteRankingQuestionType } from '@/types/questions';

interface Props {
    question: AthleteRankingQuestionType;
    answer: AthleteRankingAnswer | undefined;
    isPastDeadline: boolean;
    onAnswerChanged: (content: AthleteRankingAnswerContent) => void;
}

export default function AthleteRankingQuestion({
    question,
    answer,
    isPastDeadline,
    onAnswerChanged,
}: Props) {
    const { user } = useAuthenticatedUser();
    const [selectedIds, setSelectedIds] = useState<(number | null)[]>([
        null,
        null,
        null,
    ]);

    useEffect(() => {
        if (
            answer?.content &&
            answer.content.athlete_id_one &&
            answer.content.athlete_id_two &&
            answer.content.athlete_id_three
        ) {
            setSelectedIds([
                answer.content.athlete_id_one,
                answer.content.athlete_id_two,
                answer.content.athlete_id_three,
            ]);
        }
    }, [answer?.content]);

    const handleSelect = useCallback((index: number, id: number | null) => {
        setSelectedIds((prev) => {
            const next = [...prev];
            next[index] = id;
            return next;
        });
    }, []);

    useEffect(() => {
        const [one, two, three] = selectedIds;

        const isComplete = one && two && three;
        const isDifferent =
            one !== answer?.content?.athlete_id_one ||
            two !== answer?.content?.athlete_id_two ||
            three !== answer?.content?.athlete_id_three;

        if (isComplete && isDifferent) {
            onAnswerChanged({
                athlete_id_one: one,
                athlete_id_two: two,
                athlete_id_three: three,
            });
        }
    }, [selectedIds, answer?.content, onAnswerChanged]);

    const showCorrectAnswers =
        question.correct_answer && (isPastDeadline || isAdmin(user));

    return (
        <>
            {RANKING.map((emoji, i) => {
                const label = i === 0 ? txt.forms.yourAnswer : undefined;
                return isPastDeadline ? (
                    <AthleteLabel
                        key={i}
                        emoji={emoji}
                        label={label}
                        selected={selectedIds[i]}
                    />
                ) : (
                    <AthleteSearchBar
                        key={i}
                        emoji={emoji}
                        label={label}
                        selected={selectedIds[i]}
                        onSelect={(val) => handleSelect(i, val)}
                    />
                );
            })}
            {showCorrectAnswers && (
                <CorrectAnswer
                    maxPoints={question.points}
                    grantedPoints={answer?.points}
                >
                    {RANKING.map((emoji, i) => (
                        <AthleteLabel
                            key={i}
                            emoji={emoji}
                            selected={
                                question.correct_answer?.[
                                    getAthleteRankingKey(i)
                                ] ?? null
                            }
                        />
                    ))}
                </CorrectAnswer>
            )}
        </>
    );
}
