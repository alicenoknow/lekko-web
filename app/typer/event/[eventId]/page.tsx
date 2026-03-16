'use client';

import { useParams } from 'next/navigation';
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
import { useQuestionNavigation } from '@/hooks/useQuestionNavigation';
import EventHeader from '@/components/event/EventHeader';

export default function EventDetailPage() {
    const { token } = useAuthenticatedUser();
    const { eventId: eventIdParam } = useParams<{ eventId: string }>();
    const eventId = parseInt(eventIdParam, 10);
    const validEventId = isNaN(eventId) ? 0 : eventId;

    const { eventQuery, questionsQuery, answersQuery, isPastDeadline, userRankingQuery } =
        useEventDetails(token, validEventId);

    const event = eventQuery.data;
    const questions = questionsQuery.data?.data ?? [];
    const answers = answersQuery.data?.data ?? [];

    const {
        currentQuestionId,
        setCurrentQuestionId,
        currentIndex,
        currentQuestion,
        handlePrev,
        handleNext,
    } = useQuestionNavigation(questions);

    if (eventQuery.isLoading || questionsQuery.isLoading) {
        return <Spinner />;
    }

    if (
        !validEventId ||
        eventQuery.isError ||
        questionsQuery.isError ||
        answersQuery.isError ||
        !event
    ) {
        return <ErrorMessage errorMessage={txt.events.notFound} />;
    }

    const isCurrentQuestionUnanswered =
        currentQuestion !== null &&
        !isPastDeadline &&
        !answers.find(
            (a: Answer) =>
                a.question_id === currentQuestion.id && a.content !== null
        );

    return (
        <>
            <EventHeader
                event={event}
                totalPoints={
                    isPastDeadline
                        ? (userRankingQuery.data?.totalPoints ?? undefined)
                        : undefined
                }
                place={
                    isPastDeadline
                        ? (userRankingQuery.data?.place ?? undefined)
                        : undefined
                }
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
                        {isCurrentQuestionUnanswered && (
                            <div className='inline-flex items-center gap-3 rounded-full bg-light-yellow px-6 py-3 text-base font-semibold text-primary-dark'>
                                <FaExclamationTriangle size={18} />
                                {txt.questions.unanswered}
                            </div>
                        )}
                        <div className='absolute right-0 flex items-center gap-4'>
                            {currentIndex > 0 && (
                                <ActionIcon
                                    label={<FaArrowLeft className='text-primary-light' />}
                                    onClick={handlePrev}
                                />
                            )}
                            <span className='px-2'>
                                {currentIndex + 1} / {questions.length}
                            </span>
                            {currentIndex < questions.length - 1 && (
                                <ActionIcon
                                    label={<FaArrowRight className='text-primary-light' />}
                                    onClick={handleNext}
                                />
                            )}
                        </div>
                    </div>
                    {currentQuestion && (
                        <QuestionRenderer
                            key={currentQuestion.id}
                            question={currentQuestion}
                            answer={answers.find(
                                (a: Answer) =>
                                    a.question_id === currentQuestion.id
                            )}
                            isPastDeadline={isPastDeadline}
                            onSaveSuccess={handleNext}
                        />
                    )}
                </>
            )}
        </>
    );
}
