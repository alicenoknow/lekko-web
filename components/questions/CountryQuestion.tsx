'use client';

import { useEffect, useState } from 'react';
import { txt } from '@/nls/texts';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import { isAdmin } from '@/lib/admin';
import CountryDropdown from '../forms/CountryDropdown';
import CorrectAnswer from './common/CorrectAnswer';
import { Answer } from '@/types/answers';
import { Question } from '@/types/questions';

interface Props {
    question: Question;
    answer: Answer | undefined;
    isPastDeadline: boolean;
    onAnswerChanged: (content: Answer['content']) => void;
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

    const showCorrectAnswer =
        question.correct_answer && (isPastDeadline || isAdmin(user));

    return (
        <>
            <CountryDropdown
                label={txt.forms.yourAnswer}
                selected={selectedCountry}
                onSelect={setSelectedCountry}
                disabled={isPastDeadline}
            />
            {showCorrectAnswer && (
                <CorrectAnswer>
                    <CountryDropdown
                        selected={question.correct_answer.country}
                        onSelect={() => {}}
                        disabled
                    />
                </CorrectAnswer>
            )}
        </>
    );
}
