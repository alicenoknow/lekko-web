'use client';

import { useEffect, useState } from 'react';
import { Question } from '@/types/questions';
import { Answer } from '@/types/answers';
import CountryDropdown from '@/components/forms/CountryDropdown';
import CorrectAnswer from '../common/CorrectAnswer';

interface Props {
    question: Question;
    onAnswerChanged: (content: Answer['content']) => void;
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
