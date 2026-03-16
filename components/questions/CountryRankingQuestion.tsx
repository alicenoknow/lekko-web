'use client';

import { useEffect, useState } from 'react';
import { txt } from '@/nls/texts';
import { RANKING } from '@/lib/ranking';
import CountryDropdown from '../forms/CountryDropdown';
import CorrectAnswer from './common/CorrectAnswer';
import CountryLabel from '../forms/CountryLabel';
import {
    CountryRankingAnswer,
    CountryRankingAnswerContent,
} from '@/types/answers';
import { CountryRankingQuestion as CountryRankingQuestionType } from '@/types/questions';
import { useQuestionState } from '@/hooks/useQuestionState';

interface Props {
    question: CountryRankingQuestionType;
    answer: CountryRankingAnswer | undefined;
    isPastDeadline: boolean;
    onAnswerChanged: (content: CountryRankingAnswerContent) => void;
}

export default function CountryRankingQuestion({
    question,
    answer,
    isPastDeadline,
    onAnswerChanged,
}: Props) {
    const [selectedCountries, setSelectedCountries] = useState<
        (string | null)[]
    >([
        answer?.content?.country_one ?? null,
        answer?.content?.country_two ?? null,
        answer?.content?.country_three ?? null,
    ]);

    useEffect(() => {
        if (
            answer?.content?.country_one &&
            answer?.content?.country_two &&
            answer?.content?.country_three
        ) {
            setSelectedCountries([
                answer.content.country_one,
                answer.content.country_two,
                answer.content.country_three,
            ]);
        }
    }, [answer?.content]);

    useEffect(() => {
        const [one, two, three] = selectedCountries;

        if (
            one &&
            two &&
            three &&
            (one !== answer?.content?.country_one ||
                two !== answer?.content?.country_two ||
                three !== answer?.content?.country_three)
        ) {
            onAnswerChanged({
                country_one: one,
                country_two: two,
                country_three: three,
            });
        }
    }, [selectedCountries, answer?.content, onAnswerChanged]);

    const handleSelect = (index: number, value: string | null) => {
        setSelectedCountries((prev) => {
            const next = [...prev];
            next[index] = value;
            return next;
        });
    };

    const { admin, isLocked, showCorrectAnswers } = useQuestionState(
        question,
        isPastDeadline
    );
    const hasAnswer = !!(
        answer?.content?.country_one &&
        answer?.content?.country_two &&
        answer?.content?.country_three
    );

    return (
        <div className='flex flex-col gap-6'>
            {!admin &&
                (isLocked ? (
                    hasAnswer ? (
                        <div className='space-y-3'>
                            {selectedCountries.map((country, i) =>
                                country ? (
                                    <CountryLabel
                                        key={i}
                                        code={country}
                                        emoji={RANKING[i] ?? ''}
                                        label={i === 0 ? txt.forms.yourAnswer : undefined}
                                        isLarge
                                    />
                                ) : null
                            )}
                        </div>
                    ) : (
                        <p className='text-grey text-sm'>
                            {txt.questions.resolved}
                        </p>
                    )
                ) : (
                    <div className='space-y-3'>
                        {selectedCountries.map((country, i) => (
                            <CountryDropdown
                                key={i}
                                label={i === 0 ? txt.forms.yourAnswer : ''}
                                emoji={RANKING[i] ?? ''}
                                selected={country}
                                onSelect={(value) => handleSelect(i, value)}
                            />
                        ))}
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
                        {(
                            [
                                question.correct_answer.country_one,
                                question.correct_answer.country_two,
                                question.correct_answer.country_three,
                            ] as const
                        ).map((country, i) =>
                            country ? (
                                <CountryLabel
                                    key={i}
                                    emoji={RANKING[i]!}
                                    code={country}
                                    isLarge
                                />
                            ) : null
                        )}
                    </div>
                </CorrectAnswer>
            )}
        </div>
    );
}
