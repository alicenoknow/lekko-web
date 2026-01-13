'use client';

import { txt } from '@/nls/texts';
import { ReactNode, memo, useMemo } from 'react';

interface CorrectAnswerProps {
    children: ReactNode;
    grantedPoints?: number;
    maxPoints?: number;
}

const CorrectAnswer = memo(function CorrectAnswer({
    children,
    grantedPoints,
    maxPoints,
}: CorrectAnswerProps) {
    const backgroundClass = useMemo(() => {
        if (maxPoints === undefined) {
            return 'bg-light-green';
        }
        if (grantedPoints !== undefined) {
            if (grantedPoints === maxPoints) {
                return 'bg-light-green';
            } else if (grantedPoints > 0 && grantedPoints < maxPoints) {
                return 'bg-light-yellow';
            } else if (grantedPoints === 0) {
                return 'bg-light-red';
            }
        }
        return 'bg-light-red';
    }, [grantedPoints, maxPoints]);

    return (
        <section className={`mb-4 rounded p-4 ${backgroundClass}`}>
            <div className='md:text-md mb-4 text-sm font-bold uppercase text-primary-dark'>
                {txt.forms.correctAnswer}:
            </div>
            {children}
        </section>
    );
});

export default CorrectAnswer;
