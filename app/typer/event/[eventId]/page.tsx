'use client';

import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import { AdminOnly } from '@/components/auth/AdminOnly';
import Spinner from '@/components/Spinner';
import { txt } from '@/nls/texts';
import QuestionRenderer from '@/components/questions/QuestionRenderer';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import Pagination from '@/components/buttons/Pagination';
import { fetchEventById } from '@/app/api/events';
import { fetchQuestionsFromEvent } from '@/app/api/questions';
import { Question } from '@/types/questions';
import ActionButton from '@/components/buttons/ActionButton';
import { createAnswer, fetchAnswers, updateAnswer } from '@/app/api/answers';
import { Answer } from '@/types/answers';

export default function EventDetailPage() {
    const { eventId: eventIdParam } = useParams<{ eventId: string }>();
    const eventId = parseInt(eventIdParam, 10);
    const { token, user } = usePrivateUserContext();
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

    const questionsIds = useMemo(() => questionsData?.data?.map(q => q.id) ?? [], [questionsData?.data]);

    const {
        data: answersData,
        isLoading: isAnswersLoading,
        isError: isAnswersError,
    } = useQuery({
        queryKey: ['answers', questionsIds],
        queryFn: () => fetchAnswers(token, questionsIds),
        enabled: !!token && questionsIds.length > 0,
    });

    const isPastDeadline = useMemo(() => {
        if (eventData?.deadline){
            return new Date(eventData.deadline) < new Date();
        }
        return false;
    }, [eventData?.deadline]);

    const handleOpenAdminPanel = useCallback(() => {
        router.replace(`/typer/event/${eventId}/admin`);
    }, [router, eventId]);

    const { mutate: addAnswerQuery, isPending: isUpdatingNewAnswer } =
        useMutation({
            mutationFn: ({ questionId, content }: {
                questionId: number;
                content: { [key: string]: any; };
            }) => {
                return createAnswer(token, questionId, user.sub, content);
            }
        });

    const { mutate: modifyAnswerQuery, isPending: isUpdatingAnswer } =
        useMutation({
            mutationFn: ({ id, questionId, content }: {
                id: number;
                questionId: number;
                content: { [key: string]: any; };
            }) => {
                return updateAnswer(token, id, questionId, user.sub, content);
            }
        });

    const onAnswerSubmit = useCallback(
        (answer: Answer) => {
            if (!answer.content || !answer.question_id)
                return;

            if (answer.id < 0) {
                addAnswerQuery({ questionId: answer.question_id, content: answer.content });
            } else {
                modifyAnswerQuery({ id: answer.id, questionId: answer.question_id, content: answer.content });
            }
        },
        [eventData, addAnswerQuery, modifyAnswerQuery]
    );

    if (isEventLoading || isQuestionsLoading || isAnswersLoading) return <Spinner />;

    if (isEventError || isQuestionsError || isAnswersError || !eventData || !questionsData) {
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
                <ActionButton
                    label={txt.forms.edit}
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
                            answer={answersData?.data.find(a => a.question_id == q.id)}
                            onSubmit={onAnswerSubmit}
                            isPastDeadline={isPastDeadline}
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
