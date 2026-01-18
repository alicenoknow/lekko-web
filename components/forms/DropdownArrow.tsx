'use client';

import React from 'react';

interface DropdownArrowProps {
    className?: string;
}

const DropdownArrow: React.FC<DropdownArrowProps> = ({
    className = 'w-5 h-5 md:w-6 md:h-6 text-primary-dark',
}) => {
    return (
        <div className='pointer-events-none absolute inset-y-0 right-3 flex items-center'>
            <svg
                className={className}
                fill='currentColor'
                viewBox='0 0 20 20'
                aria-hidden='true'
            >
                <path
                    fillRule='evenodd'
                    d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                    clipRule='evenodd'
                />
            </svg>
        </div>
    );
};

export default React.memo(DropdownArrow);
