'use client';

import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import {
    fetchEventById,
    fetchQuestionsFromEvent,
    updateEvent,
    Question,
} from '@/app/api/typer';
import Spinner from '@/components/Spinner';
import { txt } from '@/nls/texts';
import QuestionRenderer from '@/components/questions/QuestionRenderer';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import Pagination from '@/components/typer/Pagination';
import { ActionButton } from '@/components/buttons';

export default function EventDetailPage() {
    const { eventId } = useParams<{ eventId: string }>();
    const { token } = usePrivateUserContext();
    const [page, setPage] = useState(1);
    const [form, setForm] = useState({
        name: '',
        description: '',
        deadline: '',
    });

    const {
        data: eventData,
        isLoading: isEventLoading,
        isError: isEventError,
    } = useQuery({
        queryKey: ['event', eventId],
        queryFn: () => fetchEventById(token, eventId),
        enabled: !!token && !!eventId,
    });

    const {
        data: questionsData,
        isLoading: isQuestionsLoading,
        isError: isQuestionsError,
    } = useQuery({
        queryKey: ['questions', eventId, page],
        queryFn: () => fetchQuestionsFromEvent(token, eventId, page),
        enabled: !!token && !!eventId,
    });

    const { mutate: update, isPending: isUpdating } = useMutation({
        mutationFn: () =>
            updateEvent(
                eventId,
                token,
                form.name,
                form.description,
                form.deadline
            ),
    });

    useEffect(() => {
        if (eventData) {
            setForm({
                name: eventData.name || '',
                description: eventData.description || '',
                deadline: eventData.deadline || '',
            });
        }
    }, [eventData]);

    const saveQuestion = useCallback(() => {
        // TODO: implement answer submission
    }, []);

    if (isEventLoading || isQuestionsLoading) return <Spinner />;

    if (isEventError || isQuestionsError || !eventData || !questionsData) {
        return <ErrorMessage errorMessage={txt.events.notFound} />;
    }

    return (
        <div className='space-y-6 p-6'>
            <div className='space-y-4'>
                <input
                    className='w-full border p-2'
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <textarea
                    className='w-full border p-2'
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                />
                <input
                    className='w-full border p-2'
                    type='datetime-local'
                    value={form.deadline}
                    onChange={(e) =>
                        setForm({ ...form, deadline: e.target.value })
                    }
                />
                <ActionButton
                    label='Save'
                    onClick={() => update()}
                    loading={isUpdating}
                />
            </div>

            <ActionButton
                label='Add Question'
                onClick={() => console.log('TODO: idk')}
            />

            {!questionsData || questionsData.data.length === 0 ? (
                <p>{txt.events.noQuestions}</p>
            ) : (
                <>
                    {questionsData.data.map((q: Question) => (
                        <QuestionRenderer
                            key={q.id}
                            question={q}
                            onSubmit={saveQuestion}
                        />
                    ))}
                    {questionsData?.pagination_info && (
                        <Pagination
                            pagination={questionsData.pagination_info}
                            changePage={(newPage) => {
                                setPage(newPage);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        />
                    )}
                </>
            )}
        </div>
    );
}
