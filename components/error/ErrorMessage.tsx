import React from 'react';

interface ErrorProps {
    errorMessage: string;
}

export const ErrorMessage = (props: ErrorProps) => {
    if (props.errorMessage) {
        return (
            <p className='mb-6 text-sm font-semibold uppercase text-red-500 md:text-lg'>
                {props.errorMessage}
            </p>
        );
    }
};
