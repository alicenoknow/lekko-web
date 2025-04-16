'use client';

import { useState } from 'react';
import { ActionButton } from '@/components/buttons';

interface Props {
    questionId: number;
    onSubmit: (answer: {
        country_one: string;
        country_two: string;
        country_three: string;
    }) => void;
}

export default function CountryRankingQuestion({
    questionId,
    onSubmit,
}: Props) {
    const [countries, setCountries] = useState(['', '', '']);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (idx: number, value: string) => {
        const next = [...countries];
        next[idx] = value;
        setCountries(next);
    };

    const handleSubmit = () => {
        if (countries.some((c) => !c.trim())) return;
        setIsSubmitting(true);
        onSubmit({
            country_one: countries[0].trim(),
            country_two: countries[1].trim(),
            country_three: countries[2].trim(),
        });
        setIsSubmitting(false);
    };

    return (
        <div className='flex flex-col gap-4'>
            {countries.map((c, idx) => (
                <input
                    key={idx}
                    className='border p-2'
                    placeholder={`#${idx + 1} Country`}
                    value={c}
                    onChange={(e) => handleChange(idx, e.target.value)}
                />
            ))}
            <ActionButton
                label='Submit Ranking'
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={countries.some((c) => !c.trim())}
            />
        </div>
    );
}
