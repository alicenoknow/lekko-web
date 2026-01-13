'use client';

import React, { useState, memo } from 'react';
import MenuLogo from './MenuLogo';
import { txt } from '@/nls/texts';
import NavButton from './NavButton';
import UserNav from './UserNav';

export function NavBarMenu() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className='z-[4] ml-auto block md:hidden'>
                <button
                    onClick={(event) => {
                        event.stopPropagation();
                        setIsOpen(!isOpen);
                    }}
                    className='border-primary-dark text-primary-dark hover:border-light-gray hover:text-light-gray z-[4] flex items-center rounded border-2 px-2 py-2'
                >
                    <MenuLogo />
                </button>
            </div>
            <div
                className={`z-[4] ${isOpen ? 'block' : 'hidden'} w-full flex-grow md:flex md:w-auto md:items-center`}
            >
                <div className='text-primary-dark ml-auto flex flex-col gap-10 text-lg font-semibold uppercase md:flex-row md:items-center md:gap-6'>
                    <NavButton title={txt.typer} link='/typer' />
                    <NavButton title={txt.ranking.title} link='/ranking' />
                    <UserNav />
                </div>
            </div>
        </>
    );
}

export default memo(NavBarMenu);
