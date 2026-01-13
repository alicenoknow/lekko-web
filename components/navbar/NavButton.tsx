'use client';

import Link from 'next/link';
import React from 'react';

interface NavButtonProps {
    title: string;
    link: string;
}

const NavButton: React.FC<NavButtonProps> = ({ title, link }) => {
    return (
        <Link
            href={link}
            className='hover:text-light-gray mt-4 block md:mt-0 md:inline-block'
        >
            {title}
        </Link>
    );
};

export default React.memo(NavButton);
