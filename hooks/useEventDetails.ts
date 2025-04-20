import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchEventById } from '@/app/api/events';
import { fetchQuestionsFromEvent } from '@/app/api/questions';
import { fetchAnswers } from '@/app/api/answers';

export function useEventDetails(token: string, eventId: number, page: number) {
    const eventQuery = useQuery({
        queryKey: ['event', eventId],
        queryFn: () => fetchEventById(token, eventId),
        enabled: !!token && !!eventId,
        staleTime: 60 * 60 * 1000,
    });

    const questionsQuery = useQuery({
        queryKey: ['questions', eventId, page],
        queryFn: () => fetchQuestionsFromEvent(token, eventId, page),
        enabled: !!token && !!eventId,
        staleTime: 60 * 60 * 1000,
    });

    const questionIds = useMemo(
        () => questionsQuery.data?.data?.map((q) => q.id) || [],
        [questionsQuery.data?.data]
    );

    const answersQuery = useQuery({
        queryKey: ['answers', questionIds],
        queryFn: () => fetchAnswers(token, questionIds),
        enabled: !!token && questionIds.length > 0,
        staleTime: 60 * 60 * 1000,
    });

    const isPastDeadline = useMemo(() => {
        const deadline = eventQuery.data?.deadline;
        return deadline ? new Date(deadline) < new Date() : false;
    }, [eventQuery.data?.deadline]);

    return {
        eventQuery,
        questionsQuery,
        answersQuery,
        questionIds,
        isPastDeadline,
    };
}
