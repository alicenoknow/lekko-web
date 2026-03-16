import { useState, useEffect, useCallback, useMemo } from 'react';
import { Question } from '@/types/questions';

export function useQuestionNavigation(questions: Question[]) {
    const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(
        null
    );

    useEffect(() => {
        if (questions.length > 0 && currentQuestionId === null) {
            setCurrentQuestionId(questions[0]?.id ?? null);
        }
    }, [questions, currentQuestionId]);

    const currentIndex = useMemo(
        () => questions.findIndex((q) => q.id === currentQuestionId),
        [questions, currentQuestionId]
    );
    const currentQuestion = useMemo(
        () => questions[currentIndex] ?? null,
        [questions, currentIndex]
    );

    const handlePrev = useCallback(() => {
        const prev = questions[currentIndex - 1];
        if (currentIndex > 0 && prev) setCurrentQuestionId(prev.id);
    }, [currentIndex, questions]);

    const handleNext = useCallback(() => {
        const next = questions[currentIndex + 1];
        if (currentIndex < questions.length - 1 && next)
            setCurrentQuestionId(next.id);
    }, [currentIndex, questions]);

    return {
        currentQuestionId,
        setCurrentQuestionId,
        currentIndex,
        currentQuestion,
        handlePrev,
        handleNext,
    };
}
