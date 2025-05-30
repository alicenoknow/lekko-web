'use client';

import { useEffect, useState } from 'react';
import { CountryRankingQuestion } from '@/types/questions';
import { CountryRankingAnswerContent } from '@/types/answers';
import CountryDropdown from '@/components/forms/CountryDropdown';
import CorrectAnswer from '../common/CorrectAnswer';

interface Props {
    question: CountryRankingQuestion;
    onAnswerChanged: (content: CountryRankingAnswerContent) => void;
}

export default function EditCountryRankingQuestion({
    question,
    onAnswerChanged,
}: Props) {
    const [selectedCountry1, setSelectedCountry1] = useState<string | null>(
        question.correct_answer?.country_one || null
    );
    const [selectedCountry2, setSelectedCountry2] = useState<string | null>(
        question.correct_answer?.country_two || null
    );
    const [selectedCountry3, setSelectedCountry3] = useState<string | null>(
        question.correct_answer?.country_three || null
    );

    useEffect(() => {
        if (selectedCountry1 && selectedCountry2 && selectedCountry3) {
            onAnswerChanged({
                country_one: selectedCountry1,
                country_two: selectedCountry2,
                country_three: selectedCountry3,
            });
        }
    }, [selectedCountry1, selectedCountry2, selectedCountry3, onAnswerChanged]);

    return (
        <CorrectAnswer>
            <CountryDropdown
                emoji='🥇'
                selected={selectedCountry1}
                onSelect={setSelectedCountry1}
            />
            <CountryDropdown
                emoji='🥈'
                selected={selectedCountry2}
                onSelect={setSelectedCountry2}
            />
            <CountryDropdown
                emoji='🥉'
                selected={selectedCountry3}
                onSelect={setSelectedCountry3}
            />
        </CorrectAnswer>
    );
}
