'use client';

import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import {
    fetchEventById,
    fetchQuestionsFromEvent,
    fetchUserAnswers,
    Question,
} from '@/app/api/typer';
import { AdminOnly } from '@/components/auth/AdminOnly';
import { PrivateContent } from '@/components/auth/PrivateContent';
import ActionIcon from '@/components/buttons/ActionIcon';
import Spinner from '@/components/Spinner';
import { txt } from '@/nls/texts';
import { FaEdit } from 'react-icons/fa';
import QuestionRenderer from '@/components/questions/QuestionRenderer';

function EventDetailPage() {
    const { eventId } = useParams<{ eventId: string }>();
    const { token } = usePrivateUserContext();
    const router = useRouter();

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
        queryKey: ['questions', eventId],
        queryFn: () => fetchQuestionsFromEvent(token, eventId),
        enabled: !!token && !!eventId,
    });

    const {
        data: answersData,
        isLoading: isAnswersLoading,
        isError: isAnswersError,
    } = useQuery({
        queryKey: ['answers', eventId],
        queryFn: () => fetchUserAnswers(eventId, token),
        enabled: !!token && !!eventId,
    });

    const isFormEmpty = useCallback(
        (questions: Question[] | undefined | null): boolean =>
            !questions || questions.length === 0,
        []
    );

    const handleOpenAdminPanel = () => {
        router.push(`/typer/event/${eventId}/admin`);
    };

    const submitAnswer = useCallback(() => {
        // TODO: implement answer submission
    }, []);

    if (isEventLoading || isQuestionsLoading || isAnswersLoading)
        return <Spinner />;

    if (!eventData) return <p className='p-6'>{txt.events.notFound}</p>;

    return (
        <div className='space-y-6 p-6'>
            <h1 className='text-3xl font-bold'>{eventData.name}</h1>
            {eventData.description && <p>{eventData.description}</p>}
            <p className='text-sm text-gray-600'>
                {txt.events.deadline}:{' '}
                {new Date(eventData.deadline).toLocaleString()}
            </p>

            <AdminOnly>
                <ActionIcon
                    label={<FaEdit size={24} />}
                    onClick={handleOpenAdminPanel}
                />
            </AdminOnly>

            {!questionsData || !questionsData.data ? (
                <p>{txt.events.noQuestions}</p>
            ) : (
                questionsData.data.map((q) => (
                    <QuestionRenderer
                        key={q.id}
                        question={q}
                        onSubmit={submitAnswer}
                    />
                ))
            )}
        </div>
    );
}

export default function PrivateEventDetailPage() {
    return (
        <PrivateContent redirect>
            <EventDetailPage />
        </PrivateContent>
    );
}
