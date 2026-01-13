import React from 'react';

interface ErrorProps {
    errorMessage: string;
}

export const ErrorMessage = (props: ErrorProps) => {
    if (props.errorMessage) {
        return (
            <p className='text-dark-red mb-6 text-sm font-semibold uppercase md:text-lg'>
                {props.errorMessage}
            </p>
        );
    }
};
