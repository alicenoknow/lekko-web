'use client';

import { useState, useEffect, useCallback } from 'react';
import { ActionButton } from '@/components/buttons';
import Spinner from '@/components/Spinner';
import { getAthletes, Athlete, Question, Athletes } from '@/app/api/typer';
import { isSuccess } from '@/app/api/common';
import { usePrivateUserContext } from '@/context/PrivateUserContext';

interface AthleteQuestionProps {
    question: Question;
    onSubmit: (answer: { athlete_id: number }) => void;
}

export default function AthleteQuestion({
    question,
    onSubmit,
}: AthleteQuestionProps) {
    const { token } = usePrivateUserContext();
    const [search, setSearch] = useState('');
    const [athletes, setAthletes] = useState<Athlete[]>([]);
    const [selected, setSelected] = useState<Athlete | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!search) {
            setAthletes([]);
            return;
        }

        const fetchAthletes = async () => {
            setLoading(true);
            try {
                const response = await getAthletes(search, token);
                if (isSuccess<Athletes>(response)) {
                    setAthletes(response.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch athletes', err);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchAthletes, 300);
        return () => clearTimeout(debounce);
    }, [search]);

    const handleSubmit = useCallback(() => {
        if (!selected) return;
        setIsSubmitting(true);
        onSubmit({ athlete_id: selected.id });
        setIsSubmitting(false);
    }, [selected, onSubmit]);

    return (
        <div className='flex flex-col gap-4'>
            {!selected && (
                <>
                    <input
                        className='border p-2'
                        placeholder='Search athlete...'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {loading && <Spinner />}
                    {athletes.length > 0 && (
                        <ul className='rounded border'>
                            {athletes.map((athlete) => (
                                <li
                                    key={athlete.id}
                                    className='cursor-pointer p-2 hover:bg-gray-100'
                                    onClick={() => setSelected(athlete)}
                                >
                                    {athlete.first_name} {athlete.last_name} (
                                    {athlete.country})
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}

            {selected && (
                <div className='flex flex-col gap-2 rounded border bg-gray-50 p-4'>
                    <div className='flex items-center justify-between'>
                        <span>
                            Selected Athlete:{' '}
                            <strong>
                                {selected.first_name} {selected.last_name}
                            </strong>{' '}
                            ({selected.country})
                        </span>
                        <button
                            className='text-sm text-red-500'
                            onClick={() => setSelected(null)}
                        >
                            Change
                        </button>
                    </div>

                    <ActionButton
                        label='Confirm Answer'
                        onClick={handleSubmit}
                        loading={isSubmitting}
                    />
                </div>
            )}

            {question.correct_answer && (
                <div className='mt-4 rounded border bg-green-50 p-4 text-sm'>
                    Correct Answer:{' '}
                    <strong>
                        {question.correct_answer.first_name}{' '}
                        {question.correct_answer.last_name}
                    </strong>{' '}
                    ({question.correct_answer.country})
                </div>
            )}
        </div>
    );
}
