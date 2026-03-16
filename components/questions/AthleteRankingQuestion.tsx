'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import AthleteSearchBar from '../forms/AthleteSearchBar';
import AthleteLabel from '../forms/AthleteLabel';
import { RANKING, getAthleteRankingKey } from '@/lib/ranking';
import { txt } from '@/nls/texts';
import CorrectAnswer from './common/CorrectAnswer';
import { FaArrowDown, FaArrowUp, FaTimes } from 'react-icons/fa';
import {
    AthleteRankingAnswer,
    AthleteRankingAnswerContent,
} from '@/types/answers';
import { AthleteRankingQuestion as AthleteRankingQuestionType } from '@/types/questions';
import { useQuestionState } from '@/hooks/useQuestionState';

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
    const [selectedIds, setSelectedIds] = useState<(number | null)[]>([
        null,
        null,
        null,
    ]);

    useEffect(() => {
        if (
            answer?.content?.athlete_id_one &&
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

    const filledIds = useMemo(
        () => selectedIds.filter((x): x is number => x !== null),
        [selectedIds]
    );

    const pad = (arr: number[]) =>
        [...arr, ...Array<null>(3 - arr.length).fill(null)] as (
            | number
            | null
        )[];

    const handleAdd = useCallback((id: number | null) => {
        if (!id) return;
        setSelectedIds((prev) => {
            const filled = prev.filter((x): x is number => x !== null);
            if (filled.length >= 3) return prev;
            return pad([...filled, id]);
        });
    }, []);

    const handleRemove = useCallback((index: number) => {
        setSelectedIds((prev) => {
            const filled = prev.filter((x): x is number => x !== null);
            filled.splice(index, 1);
            return pad(filled);
        });
    }, []);

    const handleMoveUp = useCallback((index: number) => {
        if (index === 0) return;
        setSelectedIds((prev) => {
            const filled = prev.filter((x): x is number => x !== null);
            [filled[index - 1], filled[index]] = [
                filled[index]!,
                filled[index - 1]!,
            ];
            return pad(filled);
        });
    }, []);

    const handleMoveDown = useCallback((index: number) => {
        setSelectedIds((prev) => {
            const filled = prev.filter((x): x is number => x !== null);
            if (index >= filled.length - 1) return prev;
            [filled[index + 1], filled[index]] = [
                filled[index]!,
                filled[index + 1]!,
            ];
            return pad(filled);
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

    const { admin, isLocked, showCorrectAnswers } = useQuestionState(
        question,
        isPastDeadline
    );
    const hasAnswer = !!(
        answer?.content?.athlete_id_one &&
        answer?.content?.athlete_id_two &&
        answer?.content?.athlete_id_three
    );

    return (
        <div className='flex flex-col gap-6'>
            {!admin &&
                (isLocked ? (
                    hasAnswer ? (
                        <div className='space-y-3'>
                            {RANKING.map((emoji, i) => (
                                <AthleteLabel
                                    key={i}
                                    emoji={emoji}
                                    {...(i === 0
                                        ? { label: txt.forms.yourAnswer }
                                        : {})}
                                    selected={selectedIds[i] ?? null}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className='text-grey text-sm'>
                            {txt.questions.resolved}
                        </p>
                    )
                ) : (
                    <div className='flex flex-col gap-4'>
                        <AthleteSearchBar
                            selected={null}
                            excludeIds={filledIds}
                            onSelect={handleAdd}
                            label={txt.forms.yourAnswer}
                            disabled={filledIds.length >= 3}
                            showPlaceholder={false}
                        />
                        <div className='flex flex-col gap-2'>
                            {[0, 1, 2].map((index) => {
                                const id = filledIds[index] ?? null;
                                return id ? (
                                    <div
                                        key={id}
                                        className='border-light-gray flex min-h-[64px] items-center gap-3 rounded-lg border bg-white px-3 py-2'
                                    >
                                        <div className='flex flex-col gap-0.5'>
                                            <button
                                                onClick={() =>
                                                    handleMoveUp(index)
                                                }
                                                disabled={index === 0}
                                                className='text-grey hover:text-primary-dark rounded p-1.5 disabled:opacity-20'
                                                aria-label='Move up'
                                            >
                                                <FaArrowUp size={16} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleMoveDown(index)
                                                }
                                                disabled={
                                                    index ===
                                                    filledIds.length - 1
                                                }
                                                className='text-grey hover:text-primary-dark rounded p-1.5 disabled:opacity-20'
                                                aria-label='Move down'
                                            >
                                                <FaArrowDown size={16} />
                                            </button>
                                        </div>
                                        <div className='flex-1'>
                                            <AthleteLabel
                                                selected={id}
                                                emoji={RANKING[index]!}
                                                compact
                                            />
                                        </div>
                                        <button
                                            onClick={() => handleRemove(index)}
                                            className='text-grey hover:text-dark-red flex-shrink-0 rounded p-1.5'
                                            aria-label='Remove'
                                        >
                                            <FaTimes size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        key={`empty-${index}`}
                                        className='border-light-gray flex min-h-[64px] items-center gap-3 rounded-lg border-2 border-dashed px-3 py-3 opacity-40'
                                    >
                                        <div className='w-3' />
                                        <span className='text-2xl'>
                                            {RANKING[index]}
                                        </span>
                                        <div className='border-light-gray flex-1 border-t-2 border-dashed' />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            {showCorrectAnswers && !question.correct_answer && admin && (
                <p className='text-grey text-sm'>
                    {txt.questions.noCorrectAnswer}
                </p>
            )}
            {showCorrectAnswers && question.correct_answer && (
                <CorrectAnswer
                    maxPoints={admin ? undefined : question.points}
                    grantedPoints={admin ? undefined : answer?.points}
                >
                    <div className='space-y-3'>
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
                    </div>
                </CorrectAnswer>
            )}
        </div>
    );
}
