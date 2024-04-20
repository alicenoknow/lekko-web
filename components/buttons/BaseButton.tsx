import React from 'react';

type ActionProps =
    | { link: string; onClick?: never }
    | { link?: never; onClick: () => void };

interface OwnProps {
    label: string;
    disabled?: boolean;
}

type BaseButtonProps = OwnProps & ActionProps;

const BaseButton: React.FC<BaseButtonProps> = ({
    disabled,
    label,
    link,
    onClick,
}) => {
    return (
        <button
            disabled={disabled}
            className={`select-none border-2 border-black bg-primaryLight p-4 text-xl font-extrabold uppercase hover:cursor-pointer md:px-10 ${disabled ? 'cursor-not-allowed opacity-50' : ' hover:bg-accentLight'}`}
            onClick={onClick}
        >
            {link ? (
                <a href={link}>{label}</a>
            ) : (
                <p className='text-wrap'>{label}</p>
            )}
        </button>
    );
};

export default BaseButton;
