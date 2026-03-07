import React from 'react';

interface ErrorProps {
    errorMessage: string;
}

export const ErrorMessage = (props: ErrorProps) => {
    return (
        <p
            className={`mb-6 text-sm font-semibold uppercase md:text-lg ${props.errorMessage ? 'text-dark-red' : 'invisible'}`}
        >
            {props.errorMessage || '\u00A0'}
        </p>
    );
};
