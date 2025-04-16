'use client';

import { useState } from 'react';
import { ActionButton } from '@/components/buttons';
import { Question } from '@/app/api/typer';

interface Props {
    question: Question;
    onSubmit: (data: {
        content: string;
        points: number;
        correct_answer: { country: string };
    }) => void;
}

export default function AdminCountryQuestion({ question, onSubmit }: Props) {
    const [content, setContent] = useState(question.content);
    const [points, setPoints] = useState(question.points);
    const [country, setCountry] = useState(
        question.correct_answer?.country || ''
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isFormInvalid = !content.trim() || !country.trim() || points < 1;

    const handleSubmit = () => {
        if (isFormInvalid) return;
        setIsSubmitting(true);
        onSubmit({
            content: content.trim(),
            points,
            correct_answer: { country: country.trim() },
        });
        setIsSubmitting(false);
    };

    return (
        <div className='flex flex-col gap-4 rounded border bg-gray-50 p-4'>
            <label className='text-sm font-bold'>Question Text</label>
            <input
                className='border p-2'
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            <label className='text-sm font-bold'>Points</label>
            <input
                type='number'
                min={1}
                className='border p-2'
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
            />

            <label className='text-sm font-bold'>Correct Country</label>
            <input
                className='border p-2'
                placeholder='Enter correct country...'
                value={country}
                onChange={(e) => setCountry(e.target.value)}
            />

            <ActionButton
                label='Save Changes'
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={isFormInvalid}
            />
        </div>
    );
}
