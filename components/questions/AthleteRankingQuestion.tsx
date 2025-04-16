'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ActionButton } from '@/components/buttons';
import Spinner from '@/components/Spinner';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import { Athlete, fetchAthletes } from '@/app/api/typer';

interface Props {
    questionId: number;
    onSubmit: (answer: {
        athlete_id_one: number;
        athlete_id_two: number;
        athlete_id_three: number;
    }) => void;
}

export default function AthleteRankingQuestion({
    questionId,
    onSubmit,
}: Props) {
    const { token } = usePrivateUserContext();
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<Athlete[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const canSubmit = selected.length === 3;

    const { data: athleteResult, isFetching } = useQuery({
        queryKey: ['athletes', search],
        queryFn: () => fetchAthletes(search, token),
        enabled: !!search && selected.length < 3 && !!token,
        staleTime: 30 * 1000,
    });

    const handleSelect = (athlete: Athlete) => {
        if (selected.find((a) => a.id === athlete.id)) return;
        if (selected.length >= 3) return;
        setSelected((prev) => [...prev, athlete]);
        setSearch('');
    };

    const handleRemove = (id: number) => {
        setSelected((prev) => prev.filter((a) => a.id !== id));
    };

    const handleSubmit = () => {
        if (!canSubmit) return;
        setIsSubmitting(true);
        onSubmit({
            athlete_id_one: selected[0].id,
            athlete_id_two: selected[1].id,
            athlete_id_three: selected[2].id,
        });
        setIsSubmitting(false);
    };

    return (
        <div className='flex flex-col gap-4'>
            {selected.length < 3 && (
                <input
                    className='border p-2'
                    placeholder='Search athlete...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            )}

            {isFetching && <Spinner />}

            {athleteResult?.data &&
                athleteResult.data.length > 0 &&
                selected.length < 3 && (
                    <ul className='rounded border'>
                        {athleteResult.data.map((athlete) => (
                            <li
                                key={athlete.id}
                                className='cursor-pointer p-2 hover:bg-gray-100'
                                onClick={() => handleSelect(athlete)}
                            >
                                {athlete.first_name} {athlete.last_name} (
                                {athlete.country})
                            </li>
                        ))}
                    </ul>
                )}

            {selected.length > 0 && (
                <div className='space-y-2'>
                    {selected.map((athlete, idx) => (
                        <div
                            key={athlete.id}
                            className='flex items-center justify-between rounded border p-2'
                        >
                            <span>
                                {idx + 1}. {athlete.first_name}{' '}
                                {athlete.last_name} ({athlete.country})
                            </span>
                            <button
                                className='text-sm text-red-500'
                                onClick={() => handleRemove(athlete.id)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <ActionButton
                label='Submit Ranking'
                disabled={!canSubmit}
                onClick={handleSubmit}
                loading={isSubmitting}
            />
        </div>
    );
}
