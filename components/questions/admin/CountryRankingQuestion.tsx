'use client';

import { useState } from 'react';
import { ActionButton } from '@/components/buttons';
import { Question } from '@/app/api/typer';

interface Props {
    question: Question;
    onSubmit: (question: Question) => void;
    onDelete: (questionId: number) => void;
}

export default function AdminCountryRankingQuestion({
    question,
    onSubmit,
}: Props) {
    const [content, setContent] = useState(question.content);
    const [points, setPoints] = useState(question.points);
    const [countryOne, setCountryOne] = useState(
        question.correct_answer?.country_one || ''
    );
    const [countryTwo, setCountryTwo] = useState(
        question.correct_answer?.country_two || ''
    );
    const [countryThree, setCountryThree] = useState(
        question.correct_answer?.country_three || ''
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isFormInvalid =
        !content.trim() ||
        !countryOne.trim() ||
        !countryTwo.trim() ||
        !countryThree.trim() ||
        points < 1;

    const handleSubmit = () => {
        if (isFormInvalid) return;
        setIsSubmitting(true);
        onSubmit({
            content: content.trim(),
            points,
            correct_answer: {
                country_one: countryOne.trim(),
                country_two: countryTwo.trim(),
                country_three: countryThree.trim(),
            },
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

            <label className='text-sm font-bold'>
                Correct Country - 1st Place
            </label>
            <input
                className='border p-2'
                value={countryOne}
                onChange={(e) => setCountryOne(e.target.value)}
                placeholder='e.g. Norway'
            />

            <label className='text-sm font-bold'>
                Correct Country - 2nd Place
            </label>
            <input
                className='border p-2'
                value={countryTwo}
                onChange={(e) => setCountryTwo(e.target.value)}
                placeholder='e.g. Sweden'
            />

            <label className='text-sm font-bold'>
                Correct Country - 3rd Place
            </label>
            <input
                className='border p-2'
                value={countryThree}
                onChange={(e) => setCountryThree(e.target.value)}
                placeholder='e.g. Finland'
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
