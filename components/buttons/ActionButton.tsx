import React from 'react';
import Spinner from '../Spinner';

interface ActionButtonProps {
    label: string;
    disabled?: boolean;
    loading?: boolean;
    onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
    disabled,
    loading,
    label,
    onClick,
}) => {
    return (
        <button
            disabled={disabled || loading}
            className={`select-none border-2 border-black bg-primaryLight p-4 text-xl font-extrabold uppercase hover:cursor-pointer md:px-10 ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-accentLight'}`}
            onClick={onClick}
        >
            {loading ? (
                <Spinner isInline />
            ) : (
                <p className='text-wrap'>{label}</p>
            )}
        </button>
    );
};

export default ActionButton;
