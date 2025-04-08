import React from 'react';
import Link from 'next/link';
import Spinner from '../Spinner';

interface LinkButtonProps {
    label: string;
    disabled?: boolean;
    loading?: boolean;
    link: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({
    disabled,
    loading,
    label,
    link,
}) => {
    return (
        <Link href={link} passHref>
            <button
                disabled={disabled || loading}
                className={`select-none border-2 border-black bg-primaryLight p-4 text-xl font-extrabold uppercase hover:cursor-pointer md:px-10 ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-accentLight'}`}
            >
                {loading ? (
                    <Spinner isInline />
                ) : (
                    <p className='text-wrap'>{label}</p>
                )}
            </button>
        </Link>
    );
};

export default LinkButton;
