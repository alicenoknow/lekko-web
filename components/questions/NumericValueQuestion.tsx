'use client';

import { useEffect, useState } from 'react';
import { txt } from '@/nls/texts';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { isAdmin } from '@/lib/admin';
import CorrectAnswer from './common/CorrectAnswer';
import { NumericValueQuestion as NumericValueQuestionType } from '@/types/questions';
import { NumericValueAnswer } from '@/types/answers';

interface Props {
    question: NumericValueQuestionType;
    answer: NumericValueAnswer | undefined;
    isPastDeadline: boolean;
    onAnswerChanged: (content: { value: number | null }) => void;
}

export default function NumericValueQuestion({
    question,
    answer,
    isPastDeadline,
    onAnswerChanged,
}: Props) {
    const { user } = useAuthenticatedUser();
    const [inputValue, setInputValue] = useState<string>('');

    useEffect(() => {
        if (answer?.content?.value != null) {
            setInputValue(String(answer.content.value));
        }
    }, [answer?.content?.value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        setInputValue(raw);
        const parsed = parseFloat(raw);
        if (!isNaN(parsed)) {
            onAnswerChanged({ value: parsed });
        }
    };

    const admin = isAdmin(user);
    const isResolved = !!question.correct_answer;
    const isLocked = isPastDeadline || isResolved;
    const showCorrectAnswer = admin || isLocked;

    return (
        <div className='flex flex-col gap-6'>
            {!admin && (
                <div className='flex flex-col gap-2'>
                    <label className='md:text-md text-primary-dark text-sm font-bold uppercase'>
                        {txt.forms.yourAnswer}
                    </label>
                    <input
                        type='number'
                        className='text-primary-dark w-full rounded-lg border bg-white p-2 text-sm disabled:bg-gray-100 md:p-4 md:text-lg'
                        value={inputValue}
                        onChange={handleChange}
                        disabled={isLocked}
                    />
                </div>
            )}
            {showCorrectAnswer && question.correct_answer?.value != null && (
                <CorrectAnswer
                    maxPoints={admin ? undefined : question.points}
                    grantedPoints={admin ? undefined : answer?.points}
                >
                    <span className='text-primary-dark text-lg font-bold'>
                        {question.correct_answer.value}
                    </span>
                </CorrectAnswer>
            )}
        </div>
    );
}
