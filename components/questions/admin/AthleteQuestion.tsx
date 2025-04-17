'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ActionButton } from '@/components/buttons';
import Spinner from '@/components/Spinner';
import { fetchAthletes, Athlete, Question } from '@/app/api/typer';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import DeleteQuestion from '@/components/questions/admin/DeleteQuestion';

interface Props {
    question: Question;
    onSubmit: (question: Question) => void;
    onDelete: (questionId: number) => void;
}

export default function AdminAthleteQuestion({ question, onSubmit, onDelete }: Props) {
    const { token } = usePrivateUserContext();
    const [content, setContent] = useState(question.content);
    const [points, setPoints] = useState(question.points);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<Athlete | null>(question.correct_answer || null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: athletesData, isLoading } = useQuery({
        queryKey: ['athletes', search],
        queryFn: () => fetchAthletes(search, token),
        enabled: !!token && !!search,
    });

    const athletes = athletesData?.data ?? [];

    const isFormInvalid = !content.trim() || points < 1 || !selected;

    const handleSubmit = () => {
        if (isFormInvalid) return;
        setIsSubmitting(true);
        onSubmit({
            ...question,
            content: content.trim(),
            points,
            correct_answer: selected,
        });
        setIsSubmitting(false);
    };

    return (
        <div className='relative flex flex-col gap-4 rounded border bg-gray-50 p-4'>
            <div className="flex items-center justify-between">
                <label className='text-sm font-bold'>Question Text</label>
                <DeleteQuestion questionId={question.id} onDelete={onDelete} />
            </div>
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

            {!selected && (
                <>
                    <label className='text-sm font-bold'>Search Athlete</label>
                    <input
                        className='border p-2'
                        placeholder='Search athlete...'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {isLoading && <Spinner />}
                    {athletes.length > 0 && (
                        <ul className='rounded border'>
                            {athletes.map((athlete) => (
                                <li
                                    key={athlete.id}
                                    className='cursor-pointer p-2 hover:bg-gray-100'
                                    onClick={() => setSelected(athlete)}
                                >
                                    {athlete.first_name} {athlete.last_name} ({athlete.country})
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}

            {selected && (
                <div className='flex items-center justify-between rounded border p-2'>
                    <span>
                        Selected: <strong>{selected.first_name} {selected.last_name}</strong> ({selected.country})
                    </span>
                    <button
                        className='text-sm text-red-500'
                        onClick={() => setSelected(null)}
                    >
                        Change
                    </button>
                </div>
            )}

            <ActionButton
                label='Save Changes'
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={isFormInvalid}
            />
        </div>
    );
}
