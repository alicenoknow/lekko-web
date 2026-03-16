import React from 'react';
import Spinner from '../Spinner';

interface ActionButtonProps {
    label: string | React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
}

const ActionButton = React.memo<ActionButtonProps>(function ActionButton({
    disabled,
    loading,
    label,
    onClick,
    type = 'button',
    className,
}) {
    const hoverClass = disabled
        ? 'cursor-not-allowed opacity-50'
        : 'hover:bg-accent-dark/70';

    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={`bg-accent-dark text-primary-light rounded-lg p-3 font-extrabold uppercase select-none hover:cursor-pointer sm:px-6 sm:text-lg md:px-8 md:text-xl ${hoverClass} ${className ?? ''}`}
            onClick={onClick}
        >
            {loading ? <Spinner /> : <p className='text-wrap'>{label}</p>}
        </button>
    );
});

export default ActionButton;
