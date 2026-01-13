'use client';

import { COUNTRIES } from '@/lib/countries';
import CountryLabel from './CountryLabel';
import DropdownField from './DropdownField';

interface Props {
    selected: string | null;
    label?: string;
    onSelect: (value: string | null) => void;
    emoji?: string;
    disabled?: boolean;
}

export default function CountryDropdown({
    selected,
    label,
    onSelect,
    emoji,
    disabled = false,
}: Props) {
    const countryOptions = Object.keys(COUNTRIES).map((code) => ({
        value: code,
        label: <CountryLabel code={code} />,
    }));
    return (
        <div className='relative w-full'>
            {label && (
                <p className='md:text-md text-primary-dark my-4 text-sm font-bold uppercase'>
                    {label}:
                </p>
            )}
            <div className='mb-4 flex flex-row items-center justify-between'>
                {emoji && <span className='mr-4 text-3xl'>{emoji}</span>}
                <DropdownField
                    options={countryOptions}
                    selected={selected}
                    onSelect={onSelect}
                    disabled={disabled}
                />
            </div>
        </div>
    );
}
