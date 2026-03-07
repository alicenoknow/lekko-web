import React from 'react';
import Spinner from '../Spinner';

interface ExternalLinkButtonProps {
    label: string;
    disabled?: boolean;
    loading?: boolean;
    link: string;
    className?: string;
}

const ExternalLinkButton: React.FC<ExternalLinkButtonProps> = ({
    disabled,
    loading,
    label,
    link,
    className = 'bg-primary-light hover:bg-accent-light',
}) => {
    return (
        <a
            href={link}
            target='_blank'
            rel='noopener noreferrer'
            className={`inline-block rounded-xl p-4 text-lg font-extrabold uppercase select-none hover:cursor-pointer md:px-10 md:text-3xl ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
        >
            {loading ? <Spinner /> : <p className='text-wrap'>{label}</p>}
        </a>
    );
};

export default ExternalLinkButton;
