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
            return 'bg-lightGreen';
        }
        if (grantedPoints !== undefined) {
            if (grantedPoints === maxPoints) {
                return 'bg-lightGreen';
            } else if (grantedPoints > 0 && grantedPoints < maxPoints) {
                return 'bg-lightYellow';
            } else if (grantedPoints === 0) {
                return 'bg-lightRed';
            }
        }
        return 'bg-lightRed';
    }, [grantedPoints, maxPoints]);


    return (
        <section className={`mb-4 rounded p-4 ${backgroundClass}`}>
            <div className="md:text-md mb-4 text-sm font-bold uppercase text-primaryDark">
                {txt.forms.correctAnswer}:
            </div>
            {children}
        </section>
    );
});

export default CorrectAnswer;
