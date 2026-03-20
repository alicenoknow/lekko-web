'use client';

import {
    FaArrowLeft,
    FaArrowRight,
    FaExclamationTriangle,
} from 'react-icons/fa';
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
        <div className='relative mb-3 flex items-center justify-between gap-4'>
            {showWarning && (
                <div className='bg-light-yellow text-primary-dark inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold md:absolute md:left-1/2 md:-translate-x-1/2 sm:gap-3 sm:px-6 sm:py-3 sm:text-base'>
                    <FaExclamationTriangle size={18} />
                    {txt.questions.unanswered}
                </div>
            )}
            <div className='ml-auto flex items-center gap-4'>
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
