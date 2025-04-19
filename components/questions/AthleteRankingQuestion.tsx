'use client';

import { useState, useCallback } from 'react';
import { Question, Answer } from '@/app/api/typer';
import { txt } from '@/nls/texts';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import { isAdmin } from '@/lib/Admin';
import AthleteSearchBar from '../forms/AthleteSearchBar';
import AthleteLabel from '../forms/AthleteLabel';
import CorrectAnswer from './common/CorrectAnswer';
import QuestionFooterButtons from './common/QuestionFooterButtons';
import QuestionHeader from './common/QuestionHeader';
import { getAthleteRankingKey, RANKING } from '@/lib/Ranking';

interface Props {
    question: Question;
    isPastDeadline: boolean;
    onSubmit: (answer: Answer) => void;
    onEdit?: () => void;
}

export default function AthleteRankingQuestion({
    question,
    isPastDeadline,
    onSubmit,
    onEdit,
}: Props) {
    const { user } = usePrivateUserContext();

    const answer: Answer = {
        id: 1,
        question_id: 2,
        content: {},
    };

    const [selectedIds, setSelectedIds] = useState<(number | null)[]>([
        answer?.content?.athlete_id_one || null,
        answer?.content?.athlete_id_two || null,
        answer?.content?.athlete_id_three || null,
    ]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModified, setIsModified] = useState(false);

    const isFormInvalid = selectedIds.some((id) => !id);

    const handleSelect = useCallback((index: number, id: number | null) => {
        setSelectedIds((prev) => {
            const next = [...prev];
            next[index] = id;
            return next;
        });
        setIsModified(true);
    }, []);

    const handleSubmit = useCallback(() => {
        if (isFormInvalid) return;
        setIsSubmitting(true);
        onSubmit({
            user_id: user.sub,
            question_id: question.id,
            content: {
                athlete_id_one: selectedIds[0],
                athlete_id_two: selectedIds[1],
                athlete_id_three: selectedIds[2],
            },
        });
        setIsSubmitting(false);
        setIsModified(false);
    }, [isFormInvalid, onSubmit, question.id, selectedIds, user.sub]);

    const showCorrectAnswers =
        question.correct_answer && (isPastDeadline || isAdmin(user));

    return (
        <>
            <QuestionHeader
                content={question.content}
                maxPoints={question.points}
                points={answer.points}
            />
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
                <CorrectAnswer>
                    {RANKING.map((rank, i) => {
                        const selectedId =
                            question.correct_answer?.[getAthleteRankingKey(i)];
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
