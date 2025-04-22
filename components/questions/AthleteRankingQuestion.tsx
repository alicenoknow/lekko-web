'use client';

import { useState, useCallback, useEffect } from 'react';
import AthleteSearchBar from '../forms/AthleteSearchBar';
import AthleteLabel from '../forms/AthleteLabel';
import { RANKING, getAthleteRankingKey } from '@/lib/ranking';
import { txt } from '@/nls/texts';
import CorrectAnswer from './common/CorrectAnswer';
import { isAdmin } from '@/lib/admin';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
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
    const { user } = usePrivateUserContext();
    const [selectedIds, setSelectedIds] = useState<(number | null)[]>([
        answer?.content?.athlete_id_one || null,
        answer?.content?.athlete_id_two || null,
        answer?.content?.athlete_id_three || null,
    ]);

    useEffect(() => {
        if (
            answer?.content?.athlete_id_one &&
            answer?.content?.athlete_id_two &&
            answer?.content?.athlete_id_three
        ) {
            setSelectedIds([
                answer.content.athlete_id_one,
                answer.content.athlete_id_two,
                answer.content.athlete_id_three,
            ]);
        }
    }, [
        answer?.content?.athlete_id_one,
        answer?.content?.athlete_id_two,
        answer?.content?.athlete_id_three,
    ]);

    const handleSelect = useCallback((index: number, id: number | null) => {
        setSelectedIds((prev) => {
            const next = [...prev];
            next[index] = id;
            return next;
        });
    }, []);

    useCallback(() => {
        onAnswerChanged({
            athlete_id_one: selectedIds[0],
            athlete_id_two: selectedIds[1],
            athlete_id_three: selectedIds[2],
        });
    }, [selectedIds, onAnswerChanged]);

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
            {showCorrectAnswers && question.correct_answer && (
                <CorrectAnswer>
                    {RANKING.map((rank, i) => {
                        const selectedId =
                            question.correct_answer?.[
                                getAthleteRankingKey(i)
                            ] ?? null;
                        return (
                            <AthleteLabel
                                key={i}
                                emoji={rank}
                                selected={selectedId}
                            />
                        );
                    })}
                </CorrectAnswer>
            )}
        </>
    );
}
