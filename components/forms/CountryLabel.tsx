import { COUNTRIES } from '@/lib/countries';
import React from 'react';
import Flag from 'react-world-flags';

interface Props {
    code: string;
}

function CountryLabel({ code }: Props) {
    const countryName = COUNTRIES[code] ?? code;
    return (
        <div
            className='flex flex-row items-center gap-2'
            aria-label={`Country: ${countryName}`}
        >
            <Flag className='h-6 w-6' code={code} alt={countryName} />
            <span>{countryName}</span>
        </div>
    );
}

export default React.memo(CountryLabel);
