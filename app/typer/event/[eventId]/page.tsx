'use client';

import { useCallback, useState } from 'react';
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
import ActionIcon from '@/components/buttons/ActionIcon';
import Spinner from '@/components/Spinner';
import { txt } from '@/nls/texts';
import { FaEdit } from 'react-icons/fa';
import QuestionRenderer from '@/components/questions/QuestionRenderer';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import Pagination from '@/components/typer/Pagination';

export default function EventDetailPage() {
    const { eventId: eventIdParam } = useParams<{ eventId: string }>();
    const eventId = parseInt(eventIdParam, 10);
    const { token } = usePrivateUserContext();
    const router = useRouter();
    const [page, setPage] = useState(1);

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

    // const {
    //     data: answersData,
    //     isLoading: isAnswersLoading,
    //     isError: isAnswersError,
    // } = useQuery({
    //     queryKey: ['answers', eventId],
    //     queryFn: () => fetchUserAnswers(eventId, token),
    //     enabled: !!token && !!eventId,
    // });

    const handleOpenAdminPanel = () => {
        router.replace(`/typer/event/${eventId}/admin`);
    };

    const submitAnswer = useCallback(() => {
        // TODO: implement answer submission
    }, []);

    if (isEventLoading || isQuestionsLoading) return <Spinner />;

    if (isEventError || isQuestionsError || !eventData || !questionsData) {
        return <ErrorMessage errorMessage={txt.events.notFound} />;
    }

    return (
        <div className='space-y-6 p-6'>
            <h1 className='text-3xl font-bold'>{eventData.name}</h1>
            {eventData.description && <p>{eventData.description}</p>}
            <p className='text-sm text-gray-600'>
                {txt.events.deadline}: {eventData.deadline}
            </p>

            <AdminOnly>
                <ActionIcon
                    label={<FaEdit size={24} />}
                    onClick={handleOpenAdminPanel}
                />
            </AdminOnly>

            {!questionsData || questionsData.data.length === 0 ? (
                <p>{txt.events.noQuestions}</p>
            ) : (
                <>
                    {questionsData.data.map((q: Question) => (
                        <QuestionRenderer
                            key={q.id}
                            question={q}
                            onSubmit={submitAnswer}
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
