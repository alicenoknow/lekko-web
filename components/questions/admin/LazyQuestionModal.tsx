'use client';

import React, { lazy, Suspense } from 'react';
import Spinner from '@/components/Spinner';
import { Question } from '@/types/questions';

// Lazy load the QuestionModal since it's only shown when needed
const QuestionModal = lazy(() => import('./QuestionModal'));

interface LazyQuestionModalProps {
    question: Question;
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
    onSubmit: (question: Question) => void;
    onDelete: (questionId: number) => void;
}

export default function LazyQuestionModal(props: LazyQuestionModalProps) {
    // Don't render anything if modal is closed to avoid loading
    if (!props.isOpen) {
        return null;
    }

    return (
        <Suspense
            fallback={
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='rounded-lg bg-white p-8'>
                        <Spinner />
                    </div>
                </div>
            }
        >
            <QuestionModal {...props} />
        </Suspense>
    );
}
