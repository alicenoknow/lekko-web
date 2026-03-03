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
          : 'hover:bg-blue-accent hover:text-primary-dark hover:border-blue-accent';
    return (
        <button
            aria-label={`${label} button`}
            disabled={disabled || loading}
            className={`border-grey bg-primary-light rounded-lg border-1 p-2 text-xl font-extrabold uppercase select-none hover:cursor-pointer ${hoverClass} ${variant === 'danger' ? 'text-dark-red border-dark-red' : ''} ${className}`}
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

export default ActionIcon;
