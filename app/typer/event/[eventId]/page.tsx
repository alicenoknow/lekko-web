'use client';

import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaExclamationTriangle } from 'react-icons/fa';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import Spinner from '@/components/Spinner';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import { txt } from '@/nls/texts';
import ActionIcon from '@/components/buttons/ActionIcon';
import QuestionRenderer from '@/components/questions/QuestionRenderer';
import QuestionsSideNav from '@/components/questions/QuestionsSideNav';
import { Answer } from '@/types/answers';
import { useEventDetails } from '@/hooks/useEventDetails';
import EventHeader from '@/components/event/EventHeader';

export default function EventDetailPage() {
    const { token } = useAuthenticatedUser();
    const { eventId: eventIdParam } = useParams<{ eventId: string }>();
    const eventId = parseInt(eventIdParam, 10);

    const { eventQuery, questionsQuery, answersQuery, isPastDeadline, userRankingQuery } =
        useEventDetails(token, eventId, 1);

    const event = eventQuery.data;
    const questions = questionsQuery.data?.data || [];
    const answers = answersQuery.data?.data || [];

    const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);

    useEffect(() => {
        if (questions.length > 0 && currentQuestionId === null) {
            setCurrentQuestionId(questions[0]?.id ?? null);
        }
    }, [questions, currentQuestionId]);

    const currentIndex = questions.findIndex((q) => q.id === currentQuestionId);
    const currentQuestion = questions[currentIndex] ?? null;

    const handlePrev = useCallback(() => {
        const prev = questions[currentIndex - 1];
        if (currentIndex > 0 && prev) setCurrentQuestionId(prev.id);
    }, [currentIndex, questions]);

    const handleNext = useCallback(() => {
        const next = questions[currentIndex + 1];
        if (currentIndex < questions.length - 1 && next) setCurrentQuestionId(next.id);
    }, [currentIndex, questions]);

    const handleSaveSuccess = useCallback(() => {
        const next = questions[currentIndex + 1];
        if (currentIndex < questions.length - 1 && next) {
            setCurrentQuestionId(next.id);
        }
    }, [currentIndex, questions]);

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
            <EventHeader
                event={event}
                totalPoints={
                    isPastDeadline
                        ? userRankingQuery.data?.total_points_scored ?? userRankingQuery.data?.total_points
                        : undefined
                }
                place={isPastDeadline ? userRankingQuery.data?.place ?? userRankingQuery.data?.position : undefined}
            />
            {questions.length === 0 ? (
                <p>{txt.events.noQuestions}</p>
            ) : (
                <>
                    <QuestionsSideNav
                        questions={questions}
                        answers={answers}
                        currentQuestionId={currentQuestionId}
                        onNavigate={setCurrentQuestionId}
                    />
                    <div className='relative mb-3 flex h-12 items-center justify-center'>
                        {currentQuestion && !isPastDeadline && !answers.find((a: Answer) => a.question_id === currentQuestion.id && a.content !== null) && (
                            <div className='inline-flex items-center gap-3 rounded-full bg-light-yellow px-6 py-3 text-base font-semibold text-primary-dark'>
                                <FaExclamationTriangle size={18} />
                                {txt.questions.unanswered}
                            </div>
                        )}
                        <div className='absolute right-0 flex items-center gap-4'>
                            {currentIndex > 0 && (
                                <ActionIcon label={<FaArrowLeft color={'#edf4f8'} />} onClick={handlePrev} />
                            )}
                            <span className='px-2'>
                                {currentIndex + 1} / {questions.length}
                            </span>
                            {currentIndex < questions.length - 1 && (
                                <ActionIcon label={<FaArrowRight color={'#edf4f8'} />} onClick={handleNext} />
                            )}
                        </div>
                    </div>
                    {currentQuestion && (
                        <QuestionRenderer
                            key={currentQuestion.id}
                            question={currentQuestion}
                            answer={answers.find((a: Answer) => a.question_id === currentQuestion.id)}
                            isPastDeadline={isPastDeadline}
                            onSaveSuccess={handleSaveSuccess}
                        />
                    )}
                </>
            )}
        </>
    );
}
