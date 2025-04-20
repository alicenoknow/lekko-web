import { txt } from '@/nls/texts';
import { ReactNode, memo } from 'react';

interface CorrectAnswerProps {
    children: ReactNode;
}

const CorrectAnswer = memo(function CorrectAnswer({
    children,
}: CorrectAnswerProps) {
    return (
        <section className='mb-4 rounded bg-lightGreen p-4'>
            <h3 className='md:text-md mb-4 text-sm font-bold uppercase text-primaryDark'>
                {txt.forms.correctAnswer}:
            </h3>
            {children}
        </section>
    );
});

export default CorrectAnswer;
