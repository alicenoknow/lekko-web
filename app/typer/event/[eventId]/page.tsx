'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import Spinner from '@/components/Spinner';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import { txt } from '@/nls/texts';
import Pagination from '@/components/buttons/Pagination';
import QuestionRenderer from '@/components/questions/QuestionRenderer';
import { Question } from '@/types/questions';
import { Answer } from '@/types/answers';
import { useAnswerSubmit } from '@/hooks/useAnswerSubmit';
import { useEventDetails } from '@/hooks/useEventDetails';
import EventHeader from '@/components/event/EventHeader';

export default function EventDetailPage() {
    const { token, user } = usePrivateUserContext();
    const { eventId: eventIdParam } = useParams<{ eventId: string }>();
    const eventId = parseInt(eventIdParam, 10);
    const [page, setPage] = useState(1);

    const { eventQuery, questionsQuery, answersQuery, isPastDeadline } =
        useEventDetails(token, eventId, page);

    const { onSubmit: onAnswerSubmit } = useAnswerSubmit(token, user.sub);

    const event = eventQuery.data;
    const questions = questionsQuery.data?.data || [];
    const answers = answersQuery.data?.data || [];

    if (eventQuery.isLoading || questionsQuery.isLoading) {
        return <Spinner />;
    }

    if (
        eventQuery.isError ||
        questionsQuery.isError ||
        answersQuery.isError ||
        !event
    ) {
        return <ErrorMessage errorMessage={txt.events.notFound} />;
    }

    return (
        <>
            <EventHeader event={event} />
            {questions.length === 0 ? (
                <p>{txt.events.noQuestions}</p>
            ) : (
                <>
                    {questions.map((q: Question) => (
                        <QuestionRenderer
                            key={q.id}
                            question={q}
                            answer={answers.find(
                                (a: Answer) => a.question_id === q.id
                            )}
                            onSubmit={onAnswerSubmit}
                            isPastDeadline={isPastDeadline}
                        />
                    ))}
                    {questionsQuery.data?.pagination_info && (
                        <Pagination
                            pagination={questionsQuery.data.pagination_info}
                            changePage={setPage}
                        />
                    )}
                </>
            )}
        </>
    );
}
