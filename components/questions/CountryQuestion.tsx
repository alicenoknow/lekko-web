'use client';

import { useEffect, useState } from 'react';
import { txt } from '@/nls/texts';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import { isAdmin } from '@/lib/admin';
import CountryDropdown from '../forms/CountryDropdown';
import CorrectAnswer from './common/CorrectAnswer';
import { CountryAnswer, CountryAnswerContent } from '@/types/answers';
import { CountryQuestion as CountryQuestionType } from '@/types/questions';
import CountryLabel from '../forms/CountryLabel';

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
    const { user } = usePrivateUserContext();
    const [selectedCountry, setSelectedCountry] = useState<string | null>(
        answer?.content?.country || null
    );

    useEffect(() => {
        onAnswerChanged({ country: selectedCountry });
    }, [selectedCountry, onAnswerChanged]);

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
                <CorrectAnswer>
                    <CountryLabel
                        code={question.correct_answer.country}
                        isLarge
                    />
                </CorrectAnswer>
            )}
        </>
    );
}
