import React from 'react';
import Spinner from '../Spinner';

interface ExternalLinkButtonProps {
    label: string;
    disabled?: boolean;
    loading?: boolean;
    link: string;
}

const ExternalLinkButton: React.FC<ExternalLinkButtonProps> = ({
    disabled,
    loading,
    label,
    link,
}) => {
    return (
        <a
            href={link}
            target='_blank'
            rel='noopener noreferrer'
            className={`bg-primary-light inline-block border-2 border-black p-4 text-lg font-extrabold uppercase select-none hover:cursor-pointer md:px-10 md:text-3xl ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-accent-light'}`}
        >
            {loading ? (
                <Spinner isInline />
            ) : (
                <p className='text-wrap'>{label}</p>
            )}
        </a>
    );
};

export default ExternalLinkButton;
