'use client';

import { useEffect, useState } from 'react';
import { Question, Answer } from '@/app/api/events';
import { txt } from '@/nls/texts';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import { isAdmin } from '@/lib/admin';
import { RANKING } from '@/lib/ranking';
import CountryDropdown from '../forms/CountryDropdown';
import CorrectAnswer from './common/CorrectAnswer';

interface Props {
    question: Question;
    answer: Answer;
    isPastDeadline: boolean;
    onAnswerChanged: (content: Answer['content']) => void;
}

export default function CountryRankingQuestion({
    question,
    answer,
    isPastDeadline,
    onAnswerChanged,
}: Props) {
    const { user } = usePrivateUserContext();
    const [selectedCountries, setSelectedCountries] = useState<
        (string | null)[]
    >([
        answer?.content?.country_one || null,
        answer?.content?.country_two || null,
        answer?.content?.country_three || null,
    ]);

    useEffect(() => {
        onAnswerChanged({
            country_one: selectedCountries[0],
            country_two: selectedCountries[1],
            country_three: selectedCountries[2],
        });
    }, [selectedCountries, onAnswerChanged]);

    const showCorrectAnswers =
        question.correct_answer && (isPastDeadline || isAdmin(user));

    return (
        <>
            {selectedCountries.map((country, i) => (
                <CountryDropdown
                    key={i}
                    label={i === 0 ? txt.forms.yourAnswer : ''}
                    emoji={RANKING[i]}
                    selected={country}
                    onSelect={(value) =>
                        setSelectedCountries((prev) => {
                            const next = [...prev];
                            next[i] = value;
                            return next;
                        })
                    }
                    disabled={isPastDeadline}
                />
            ))}
            {showCorrectAnswers && (
                <CorrectAnswer>
                    {[
                        question.correct_answer.country_one,
                        question.correct_answer.country_two,
                        question.correct_answer.country_three,
                    ].map((country, i) => (
                        <CountryDropdown
                            key={i}
                            emoji={RANKING[i]}
                            selected={country}
                            onSelect={() => {}}
                            disabled
                        />
                    ))}
                </CorrectAnswer>
            )}
        </>
    );
}
