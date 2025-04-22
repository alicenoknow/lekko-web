'use client';

import React from 'react';

interface Props {
    label: string | number;
}

function Label({ label }: Props) {
    return (
        <div className='flex items-center gap-2 text-lg font-semibold uppercase'>
            {label}
        </div>
    );
}

export default React.memo(Label);
