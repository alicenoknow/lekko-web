import React from 'react';
import Spinner from '../Spinner';

interface ActionIconProps {
    label: string | React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
    onClick: () => void;
}

const ActionIcon = React.memo<ActionIconProps>(function ActionIcon({
    disabled,
    loading,
    label,
    onClick,
}) {
    return (
        <button
            aria-label={`${label} button`}
            disabled={disabled || loading}
            className={`border-grey bg-primary-light border-1 p-2 text-xl font-extrabold uppercase select-none hover:cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-accent-light'}`}
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
