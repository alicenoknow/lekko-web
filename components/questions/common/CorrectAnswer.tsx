import { txt } from '@/nls/texts';
import React, { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

export default function CorrectAnswer({ children }: Props) {
    return (
        <div className='mb-4 bg-lightGreen p-4'>
            <p className='mb-4 text-sm font-bold uppercase text-primaryDark md:text-md'>
                {txt.forms.correctAnswer}:
            </p>
            {children}
        </div>
    );
}
