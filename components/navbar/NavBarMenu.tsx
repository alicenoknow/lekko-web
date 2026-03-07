'use client';

import { useState, memo, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import MenuLogo from './MenuLogo';
import { txt } from '@/nls/texts';
import NavButton from './NavButton';
import UserNav from './UserNav';

export function NavBarMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!isOpen) return;
        function handleClickOutside(event: MouseEvent | TouchEvent) {
            const target = event.target as Node;
            if (
                !buttonRef.current?.contains(target) &&
                !dropdownRef.current?.contains(target)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <>
            <div ref={buttonRef} className='z-[4] ml-auto block md:hidden'>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className='border-primary-dark text-primary-dark hover:border-grey hover:text-grey z-[4] flex items-center rounded border-2 px-2 py-2'
                >
                    <MenuLogo />
                </button>
            </div>
            <div
                ref={dropdownRef}
                className={`${isOpen ? 'block' : 'hidden'} bg-accent-light absolute top-full right-0 left-0 z-[5] border-b md:relative md:top-auto md:flex md:w-auto md:flex-grow md:items-center md:border-b-0 md:bg-transparent`}
            >
                <div className='text-primary-dark ml-auto flex flex-col items-center gap-10 text-lg font-semibold uppercase md:flex-row md:items-center md:gap-6'>
                    <NavButton title={txt.typer} link='/typer' />
                    <NavButton title={txt.ranking.title} link='/ranking' />
                    <UserNav />
                </div>
            </div>
        </>
    );
}

export default memo(NavBarMenu);
