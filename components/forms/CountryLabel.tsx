import { COUNTRIES } from '@/lib/countries';
import React from 'react';
import Flag from 'react-world-flags';

interface Props {
    code: string;
    isLarge?: boolean;
    emoji?: string;
}

function CountryLabel({ code, emoji, isLarge = false }: Props) {
    const countryName = COUNTRIES[code] ?? code;
    return (
        <div
            className='my-1 flex flex-row items-center gap-2'
            aria-label={`Country: ${countryName}`}
        >
            {emoji && <span className='mr-4 text-3xl'>{emoji}</span>}
            <Flag className='h-6 w-6' code={code} alt={countryName} />
            <span className={isLarge ? 'semibold text-xl uppercase' : ''}>
                {countryName}
            </span>
        </div>
    );
}

export default React.memo(CountryLabel);
