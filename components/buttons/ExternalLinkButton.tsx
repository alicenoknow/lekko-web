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
            className={`inline-block select-none border-2 border-black bg-primaryLight p-4 text-lg font-extrabold uppercase hover:cursor-pointer md:px-10 md:text-3xl ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-accentLight'}`}
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
