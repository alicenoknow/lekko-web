'use client';

import { useState, useEffect } from 'react';
import CorrectAnswer from '../common/CorrectAnswer';
import { NumericValueQuestion } from '@/types/questions';

interface Props {
    question: NumericValueQuestion;
    onAnswerChanged: (content: { value: number | null }) => void;
}

export default function EditNumericValueQuestion({
    question,
    onAnswerChanged,
}: Props) {
    const [inputValue, setInputValue] = useState<string>(
        question.correct_answer?.value != null
            ? String(question.correct_answer.value)
            : ''
    );

    useEffect(() => {
        const parsed = parseFloat(inputValue);
        if (!isNaN(parsed)) {
            onAnswerChanged({ value: parsed });
        }
    }, [inputValue, onAnswerChanged]);

    return (
        <CorrectAnswer>
            <input
                type='number'
                className='text-primary-dark w-full rounded-lg border bg-white p-2 text-sm md:p-4 md:text-lg'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
        </CorrectAnswer>
    );
}
