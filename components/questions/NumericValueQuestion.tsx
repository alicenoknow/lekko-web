'use client';

import { txt } from '@/nls/texts';
import CorrectAnswer from './common/CorrectAnswer';
import { NumericValueQuestion as NumericValueQuestionType } from '@/types/questions';
import { NumericValueAnswer } from '@/types/answers';
import { useQuestionState } from '@/hooks/useQuestionState';
import { useAnswerSync } from '@/hooks/useAnswerSync';

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
    const [numericValue, setNumericValue] = useAnswerSync<number | null>(
        answer?.content?.value ?? null,
        (v) => onAnswerChanged({ value: v })
    );

    const inputValue = numericValue != null ? String(numericValue) : '';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const parsed = parseFloat(e.target.value);
        setNumericValue(isNaN(parsed) ? null : parsed);
    };

    const { admin, isLocked, showCorrectAnswer } = useQuestionState(
        question,
        isPastDeadline
    );
    const hasAnswer = answer?.content?.value != null;

    return (
        <div className='flex flex-col gap-6'>
            {!admin &&
                (isLocked ? (
                    hasAnswer ? (
                        <div className='flex flex-col gap-2'>
                            <label className='md:text-md text-primary-dark text-sm font-bold uppercase'>
                                {txt.forms.yourAnswer}
                            </label>
                            <input
                                type='number'
                                className='input-field disabled:bg-gray-100'
                                value={inputValue}
                                onChange={handleChange}
                                disabled
                            />
                        </div>
                    ) : (
                        <p className='text-grey text-sm'>
                            {txt.questions.resolved}
                        </p>
                    )
                ) : (
                    <div className='flex flex-col gap-2'>
                        <label className='md:text-md text-primary-dark text-sm font-bold uppercase'>
                            {txt.forms.yourAnswer}
                        </label>
                        <input
                            type='number'
                            className='input-field disabled:bg-gray-100'
                            value={inputValue}
                            onChange={handleChange}
                        />
                    </div>
                ))}
            {showCorrectAnswer && question.correct_answer?.value != null && (
                <CorrectAnswer
                    maxPoints={admin ? undefined : question.points}
                    grantedPoints={admin ? undefined : answer?.points}
                >
                    <p className='text-primary-dark text-left text-lg font-bold'>
                        {question.correct_answer.value}
                    </p>
                </CorrectAnswer>
            )}
            {admin && !question.correct_answer && (
                <p className='text-grey text-sm'>
                    {txt.questions.noCorrectAnswer}
                </p>
            )}
        </div>
    );
}
