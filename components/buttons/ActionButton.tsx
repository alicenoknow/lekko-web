import React from 'react';
import Spinner from '../Spinner';

interface ActionButtonProps {
    label: string | React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
    onClick: () => void;
    className?: string;
}

const ActionButton = React.memo<ActionButtonProps>(function ActionButton({
    disabled,
    loading,
    label,
    onClick,
    className,
}) {
    return (
        <button
            disabled={disabled || loading}
            className={`bg-primary-light rounded-lg border-2 border-black p-3 text-base font-extrabold uppercase select-none hover:cursor-pointer sm:px-6 sm:text-lg md:px-8 md:text-xl ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-accent hover:text-primary-dark hover:border-blue-accent'} ${className ?? ''}`}
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
