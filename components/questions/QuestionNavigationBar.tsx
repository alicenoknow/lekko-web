'use client';

import { FaArrowLeft, FaArrowRight, FaExclamationTriangle } from 'react-icons/fa';
import ActionIcon from '@/components/buttons/ActionIcon';
import { txt } from '@/nls/texts';

interface QuestionNavigationBarProps {
    currentIndex: number;
    total: number;
    onPrev: () => void;
    onNext: () => void;
    showWarning?: boolean;
}

export function QuestionNavigationBar({
    currentIndex,
    total,
    onPrev,
    onNext,
    showWarning,
}: QuestionNavigationBarProps) {
    return (
        <div className='relative mb-3 flex h-12 items-center justify-center'>
            {showWarning && (
                <div className='inline-flex items-center gap-3 rounded-full bg-light-yellow px-6 py-3 text-base font-semibold text-primary-dark'>
                    <FaExclamationTriangle size={18} />
                    {txt.questions.unanswered}
                </div>
            )}
            <div className='absolute right-0 flex items-center gap-4'>
                {currentIndex > 0 && (
                    <ActionIcon
                        label={<FaArrowLeft className='text-primary-light' />}
                        onClick={onPrev}
                    />
                )}
                <span className='px-2'>
                    {currentIndex + 1} / {total}
                </span>
                {currentIndex < total - 1 && (
                    <ActionIcon
                        label={<FaArrowRight className='text-primary-light' />}
                        onClick={onNext}
                    />
                )}
            </div>
        </div>
    );
}
