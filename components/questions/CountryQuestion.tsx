'use client';

import { useEffect, useState } from 'react';
import { txt } from '@/nls/texts';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { isAdmin } from '@/lib/admin';
import CountryDropdown from '../forms/CountryDropdown';
import CorrectAnswer from './common/CorrectAnswer';
import CountryLabel from '../forms/CountryLabel';
import { CountryAnswer, CountryAnswerContent } from '@/types/answers';
import { CountryQuestion as CountryQuestionType } from '@/types/questions';

interface Props {
    question: CountryQuestionType;
    answer: CountryAnswer | undefined;
    isPastDeadline: boolean;
    onAnswerChanged: (content: CountryAnswerContent) => void;
}

export default function CountryQuestion({
    question,
    answer,
    isPastDeadline,
    onAnswerChanged,
}: Props) {
    const { user } = useAuthenticatedUser();
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

    useEffect(() => {
        if (answer?.content?.country) {
            setSelectedCountry(answer.content.country);
        }
    }, [answer?.content?.country]);

    useEffect(() => {
        if (selectedCountry && selectedCountry !== answer?.content?.country) {
            onAnswerChanged({ country: selectedCountry });
        }
    }, [selectedCountry, answer?.content?.country, onAnswerChanged]);

    const showCorrectAnswer = isPastDeadline || isAdmin(user);

    return (
        <>
            <CountryDropdown
                label={txt.forms.yourAnswer}
                selected={selectedCountry}
                onSelect={setSelectedCountry}
                disabled={isPastDeadline}
            />
            {showCorrectAnswer && question.correct_answer?.country && (
                <CorrectAnswer
                    maxPoints={question.points}
                    grantedPoints={answer?.points}
                >
                    <CountryLabel
                        code={question.correct_answer.country}
                        isLarge
                    />
                </CorrectAnswer>
            )}
        </>
    );
}
