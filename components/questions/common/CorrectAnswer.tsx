'use client';

import { txt } from '@/nls/texts';
import { ReactNode, memo, useMemo } from 'react';
import { FaCheckCircle, FaTimesCircle, FaMinusCircle } from 'react-icons/fa';

interface CorrectAnswerProps {
    children: ReactNode;
    grantedPoints?: number | undefined;
    maxPoints?: number | undefined;
}

const CorrectAnswer = memo(function CorrectAnswer({
    children,
    grantedPoints,
    maxPoints,
}: CorrectAnswerProps) {
    const { backgroundClass, borderClass, iconColor, icon } = useMemo(() => {
        if (maxPoints === undefined) {
            return {
                backgroundClass: 'bg-light-green',
                borderClass: 'border-dark-green',
                iconColor: 'text-dark-green',
                icon: <FaCheckCircle />,
            };
        }
        if (grantedPoints !== undefined) {
            if (grantedPoints === maxPoints) {
                return {
                    backgroundClass: 'bg-light-green',
                    borderClass: 'border-dark-green',
                    iconColor: 'text-dark-green',
                    icon: <FaCheckCircle />,
                };
            } else if (grantedPoints > 0 && grantedPoints < maxPoints) {
                return {
                    backgroundClass: 'bg-light-yellow',
                    borderClass: 'border-yellow-600',
                    iconColor: 'text-yellow-600',
                    icon: <FaMinusCircle />,
                };
            } else if (grantedPoints === 0) {
                return {
                    backgroundClass: 'bg-light-red',
                    borderClass: 'border-dark-red',
                    iconColor: 'text-dark-red',
                    icon: <FaTimesCircle />,
                };
            }
        }
        return {
            backgroundClass: 'bg-light-red',
            borderClass: 'border-dark-red',
            iconColor: 'text-dark-red',
            icon: <FaTimesCircle />,
        };
    }, [grantedPoints, maxPoints]);

    return (
        <section
            className={`rounded-lg border-2 ${borderClass} ${backgroundClass} p-4 md:p-6`}
        >
            <div className='mb-4 flex items-center gap-3'>
                <span className={`text-xl ${iconColor}`}>{icon}</span>
                <div className='text-sm font-bold uppercase text-primary-dark md:text-base'>
                    {txt.forms.correctAnswer}
                </div>
            </div>
            <div className='ml-8'>{children}</div>
        </section>
    );
});

export default CorrectAnswer;
