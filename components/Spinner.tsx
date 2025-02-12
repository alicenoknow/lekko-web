import React from 'react';

const Spinner = () => {
    return (
        <div className='flex h-screen items-center justify-center'>
            <div className='h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-gray-900'></div>
        </div>
    );
};

export default Spinner;
