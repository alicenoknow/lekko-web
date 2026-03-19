'use client';

import { useRef, useState, useEffect } from 'react';
import { Question } from '@/types/questions';
import { Answer } from '@/types/answers';

interface Props {
    questions: Question[];
    answers: Answer[];
    currentQuestionId: number | null;
    onNavigate: (id: number) => void;
    adminMode?: boolean;
}

type NavItemState = 'correct' | 'incorrect' | 'answered' | 'unanswered';

function QuestionNavItem({
    index,
    question,
    state,
    isActive,
    onNavigate,
}: {
    index: number;
    question: Question;
    state: NavItemState;
    isActive: boolean;
    onNavigate: (id: number) => void;
}) {
    const baseCircle =
        'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 text-sm font-bold transition-all duration-300';

    const circleClass =
        state === 'correct'
            ? `${baseCircle} border-dark-green bg-light-green/40 text-dark-green`
            : state === 'incorrect'
              ? `${baseCircle} border-dark-red bg-light-red/40 text-dark-red`
              : state === 'answered'
                ? `${baseCircle} border-2 border-primary-dark bg-primary-dark/10 text-primary-dark`
                : `${baseCircle} border-dashed border-grey bg-white/40 text-grey`;

    return (
        <button
            onClick={() => onNavigate(question.id)}
            title={question.content}
            data-question-id={question.id}
            className='group flex items-center gap-3 text-left transition-opacity duration-300'
        >
            <span
                className={
                    isActive
                        ? `${baseCircle} border-primary-dark bg-accent-light text-primary-dark`
                        : circleClass
                }
            >
                {index + 1}
            </span>
            <span className='text-primary-dark max-w-[160px] truncate text-base opacity-80 transition-opacity duration-300 group-hover:opacity-100 md:block'>
                {question.content}
            </span>
        </button>
    );
}

export default function QuestionsSideNav({
    questions,
    answers,
    currentQuestionId,
    onNavigate,
    adminMode = false,
}: Props) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const mobileScrollRef = useRef<HTMLDivElement>(null);
    const [showTopFade, setShowTopFade] = useState(false);
    const [showBottomFade, setShowBottomFade] = useState(false);

    const getState = (q: Question): NavItemState => {
        if (adminMode) {
            return q.correct_answer ? 'correct' : 'unanswered';
        }
        const answer = answers.find(
            (a) => a.question_id === q.id && a.content !== null
        );
        const hasCorrectAnswer = !!q.correct_answer;
        if (hasCorrectAnswer) {
            return answer && (answer.points ?? 0) > 0 ? 'correct' : 'incorrect';
        }
        return answer ? 'answered' : 'unanswered';
    };

    useEffect(() => {
        if (currentQuestionId === null) return;

        const scrollToCenter = (
            container: HTMLDivElement,
            vertical: boolean
        ) => {
            const active = container.querySelector<HTMLElement>(
                `[data-question-id="${currentQuestionId}"]`
            );
            if (!active) return;
            if (vertical) {
                container.scrollTo({
                    top:
                        active.offsetTop -
                        container.clientHeight / 2 +
                        active.offsetHeight / 2,
                    behavior: 'smooth',
                });
            } else {
                container.scrollTo({
                    left:
                        active.offsetLeft -
                        container.clientWidth / 2 +
                        active.offsetWidth / 2,
                    behavior: 'smooth',
                });
            }
        };

        if (scrollContainerRef.current)
            scrollToCenter(scrollContainerRef.current, true);
        if (mobileScrollRef.current)
            scrollToCenter(mobileScrollRef.current, false);
    }, [currentQuestionId]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            setShowTopFade(scrollTop > 5);
            setShowBottomFade(scrollHeight - scrollTop - clientHeight > 5);
        };

        container.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    if (questions.length === 0) return null;

    const maskGradient = `linear-gradient(to bottom, ${showTopFade ? 'transparent 0%, black 16%' : 'black 0%'}, black ${showTopFade ? '16%' : '0%'}, black ${showBottomFade ? '84%' : '100%'}, ${showBottomFade ? 'transparent 100%' : 'black 100%'})`;

    return (
        <>
            <div className='bg-primary-light sticky top-0 z-[3] md:hidden'>
                <div
                    ref={mobileScrollRef}
                    className='flex gap-2 overflow-x-auto px-6 py-2'
                    style={{ scrollbarWidth: 'none' }}
                >
                    {questions.map((q, i) => (
                        <QuestionNavItem
                            key={q.id}
                            index={i}
                            question={q}
                            state={getState(q)}
                            isActive={q.id === currentQuestionId}
                            onNavigate={onNavigate}
                        />
                    ))}
                </div>
            </div>
            <div className='fixed top-1/2 left-6 z-20 hidden w-56 -translate-y-1/2 md:flex'>
                <div
                    ref={scrollContainerRef}
                    className='flex max-h-[60vh] w-full flex-col gap-3 overflow-y-auto py-6 pr-2 pl-4'
                    style={{
                        scrollbarWidth: 'none',
                        maskImage: maskGradient,
                        WebkitMaskImage: maskGradient,
                        maskSize: '100% 100%',
                        WebkitMaskSize: '100% 100%',
                        transition:
                            'mask-image 0.3s ease, -webkit-mask-image 0.3s ease',
                    }}
                >
                    {questions.map((q, i) => (
                        <QuestionNavItem
                            key={q.id}
                            index={i}
                            question={q}
                            state={getState(q)}
                            isActive={q.id === currentQuestionId}
                            onNavigate={onNavigate}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
