import React from 'react';
import Spinner from '../Spinner';

interface ActionButtonProps {
    label: string | React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
    onClick: () => void;
}

const ActionButton = React.memo<ActionButtonProps>(function ActionButton({
    disabled,
    loading,
    label,
    onClick,
}) {
    return (
        <button
            disabled={disabled || loading}
            className={`bg-primary-light border-2 border-black p-3 text-base font-extrabold uppercase select-none hover:cursor-pointer sm:px-6 sm:text-lg md:px-8 md:text-xl ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-accent-light'}`}
            onClick={onClick}
        >
            {loading ? (
                <Spinner isInline />
            ) : (
                <p className='text-wrap'>{label}</p>
            )}
        </button>
    );
});

export default ActionButton;
