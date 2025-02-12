import React, { memo } from 'react';

const MenuLogo: React.FC = () => (
    <svg
        className='h-4 w-4 fill-current'
        viewBox='0 0 20 20'
        xmlns='http://www.w3.org/2000/svg'
    >
        <title>Menu</title>
        <path d='M0 3h20v3H0V3zm0 6h20v3H0V9zm0 6h20v3H0v15z' />
    </svg>
);

export default memo(MenuLogo);
