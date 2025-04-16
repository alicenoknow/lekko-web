import React from 'react';
import Spinner from '../Spinner';

interface ActionIconProps {
    label: string | React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
    onClick: () => void;
}

const ActionIcon: React.FC<ActionIconProps> = ({
    disabled,
    loading,
    label,
    onClick,
}) => {
    return (
        <button
            disabled={disabled || loading}
            className={`border-1 border-grey select-none bg-primaryLight p-4 text-xl font-extrabold uppercase hover:cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-accentLight'}`}
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

export default ActionIcon;
