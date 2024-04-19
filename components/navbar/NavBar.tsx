'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';

const title = 'Lekkoatletawka';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const NavButton = useCallback(
    ({ title, link }: { title: string; link: string }) => {
      return (
        <Link
          href={link}
          className='hover:text-primaryLight ml-10 mt-4 block md:mt-0 md:inline-block '
        >
          {title}
        </Link>
      );
    },
    []
  );

  const MenuButton = React.memo(function MenuButton() {
    return (
      <div className='z-[4] block md:hidden'>
        <button
          onClick={(event) => {
            event.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className='border-primaryDark text-primaryDark hover:text-primaryLight hover:border-primaryLight z-[4] flex items-center rounded border px-3 py-2'
        >
          <svg
            className='h-3 w-3 fill-current'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <title>Menu</title>
            <path d='M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v15z' />
          </svg>
        </button>
      </div>
    );
  });

  const Logo = React.memo(function Logo() {
    return (
      <div className='text-primaryDark mr-6 flex flex-shrink-0 items-center'>
        <span className='text-2xl font-bold uppercase tracking-tight'>
          {title}
        </span>
      </div>
    );
  });

  return (
    <nav className='bg-accentLight z-[4] flex flex-wrap items-center justify-between border-b p-6'>
      <Logo />
      <MenuButton />
      <div
        className={`z-[4] ${isOpen ? 'block' : 'hidden'} block w-full flex-grow md:flex md:w-auto md:items-center`}
      >
        <div className='text-primaryDark text-lg font-semibold uppercase md:flex-grow'>
          <NavButton title='Strona główna' link='/' />
          <NavButton title='Zasady' link='/rules' />
          <NavButton title='Typer' link='/typer' />
          <NavButton title='Wyniki' link='/results' />
          <NavButton title='Konto' link='/user' />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
