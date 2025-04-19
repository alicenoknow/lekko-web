'use client';

import { useState, useCallback, useMemo } from 'react';
import { Question, Answer } from '@/app/api/typer';
import { txt } from '@/nls/texts';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import { isAdmin } from '@/lib/Admin';
import CountryDropdown from '../forms/CountryDropdown';
import CorrectAnswer from './common/CorrectAnswer';
import QuestionFooterButtons from './common/QuestionFooterButtons';
import QuestionHeader from './common/QuestionHeader';
import { RANKING } from '@/lib/Ranking';

interface Props {
    question: Question;
    isPastDeadline: boolean;
    onSubmit: (answer: Answer) => void;
    onEdit?: () => void;
}

export default function CountryRankingQuestion({
    question,
    isPastDeadline,
    onSubmit,
    onEdit,
}: Props) {
    const { user } = usePrivateUserContext();

    // TODO
    const answer: Answer = {
        id: 1,
        question_id: 2,
        content: {},
    };

    const [selectedCountries, setSelectedCountries] = useState<
        (string | null)[]
    >([
        answer?.content?.country_one || null,
        answer?.content?.country_two || null,
        answer?.content?.country_three || null,
    ]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModified, setModified] = useState(false);

    const isFormInvalid = selectedCountries.some((c) => !c);

    const handleSelectCountry = useCallback(
        (index: number, value: string | null) => {
            setSelectedCountries((prev) => {
                const next = [...prev];
                next[index] = value;
                return next;
            });
            setModified(true);
        },
        []
    );

    const handleSubmit = useCallback(() => {
        if (isFormInvalid) return;
        setIsSubmitting(true);
        onSubmit({
            user_id: user.sub,
            question_id: question.id,
            content: {
                country_one: selectedCountries[0],
                country_two: selectedCountries[1],
                country_three: selectedCountries[2],
            },
        });
        setIsSubmitting(false);
        setModified(false);
    }, [isFormInvalid, onSubmit, question.id, selectedCountries, user.sub]);

    const showCorrectAnswers =
        question.correct_answer && (isPastDeadline || isAdmin(user));

    return (
        <>
            <QuestionHeader
                content={question.content}
                maxPoints={question.points}
                points={answer.points}
            />
            {selectedCountries.map((country, i) => (
                <CountryDropdown
                    key={i}
                    label={i == 0 ? txt.forms.yourAnswer : ''}
                    emoji={RANKING[i]}
                    selected={country}
                    onSelect={(value) => handleSelectCountry(i, value)}
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
