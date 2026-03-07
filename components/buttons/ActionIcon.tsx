import React from 'react';
import Spinner from '../Spinner';

interface ActionIconProps {
    label: string | React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
    onClick: () => void;
    className?: string;
    variant?: 'default' | 'danger';
}

const ActionIcon = React.memo<ActionIconProps>(function ActionIcon({
    disabled,
    loading,
    label,
    onClick,
    className = '',
    variant = 'default',
}) {
    const hoverClass = disabled
        ? 'cursor-not-allowed opacity-50'
        : variant === 'danger'
          ? 'hover:bg-dark-red hover:text-white hover:border-dark-red'
          : 'hover:bg-accent-dark/70';
    return (
        <button
            aria-label={`${label} button`}
            disabled={disabled || loading}
            className={`bg-accent-dark rounded-lg p-2 text-xl font-extrabold uppercase select-none hover:cursor-pointer ${hoverClass} ${variant === 'danger' ? 'text-dark-red border-dark-red' : ''} ${className}`}
            onClick={onClick}
        >
            {loading ? <Spinner /> : <p className='text-wrap'>{label}</p>}
        </button>
    );
});

export default ActionIcon;
