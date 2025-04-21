'use client';

import { useEffect, useState } from 'react';
import { CountryQuestion } from '@/types/questions';
import { CountryAnswerContent } from '@/types/answers';
import CountryDropdown from '@/components/forms/CountryDropdown';
import CorrectAnswer from '../common/CorrectAnswer';

interface Props {
    question: CountryQuestion;
    onAnswerChanged: (content: CountryAnswerContent) => void;
}

export default function EditCountryQuestion({
    question,
    onAnswerChanged,
}: Props) {
    const [selectedCountry, setSelectedCountry] = useState<string | null>(
        question.correct_answer?.country || null
    );

    useEffect(() => {
        if (selectedCountry !== null) {
            onAnswerChanged({ country: selectedCountry });
        }
    }, [selectedCountry, onAnswerChanged]);

    return (
        <CorrectAnswer>
            <CountryDropdown
                selected={selectedCountry}
                onSelect={setSelectedCountry}
            />
        </CorrectAnswer>
    );
}
