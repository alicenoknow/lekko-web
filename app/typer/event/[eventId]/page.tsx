'use client';

import { useParams } from 'next/navigation';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import Spinner from '@/components/Spinner';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import { txt } from '@/nls/texts';
import QuestionRenderer from '@/components/questions/QuestionRenderer';
import QuestionsSideNav from '@/components/questions/QuestionsSideNav';
import { QuestionNavigationBar } from '@/components/questions/QuestionNavigationBar';
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
                    <QuestionNavigationBar
                        currentIndex={currentIndex}
                        total={questions.length}
                        onPrev={handlePrev}
                        onNext={handleNext}
                        showWarning={isCurrentQuestionUnanswered}
                    />
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
