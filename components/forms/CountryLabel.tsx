import { COUNTRIES } from '@/lib/countries';
import React from 'react';
import Flag from 'react-world-flags';

interface Props {
    code: string;
    isLarge?: boolean;
    emoji?: string;
    label?: string | undefined;
    forceFullName?: boolean;
}

function CountryLabel({
    code,
    emoji,
    isLarge = false,
    label,
    forceFullName = false,
}: Props) {
    const countryName = COUNTRIES[code] ?? code;
    return (
        <div className='flex flex-col gap-2'>
            {label && (
                <p className='md:text-md text-primary-dark text-sm font-bold uppercase'>
                    {label}:
                </p>
            )}
            <div
                className='flex flex-row items-center gap-2'
                aria-label={`Country: ${countryName}`}
            >
                {emoji && <span className='mr-4 text-3xl'>{emoji}</span>}
                <Flag className='h-6 w-6' code={code} alt={countryName} />
                <span className={isLarge ? 'semibold text-xl uppercase' : ''}>
                    {forceFullName ? (
                        countryName
                    ) : (
                        <>
                            <span className='sm:hidden'>{code}</span>
                            <span className='hidden sm:inline'>
                                {countryName}
                            </span>
                        </>
                    )}
                </span>
            </div>
        </div>
    );
}

export default React.memo(CountryLabel);
