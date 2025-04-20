import { COUNTRIES } from '@/lib/countries';
import CountryLabel from './CountryLabel';
import DropdownField from './DropdownField';
import { useMemo } from 'react';

export default function CountryDropdown({
    selected,
    label,
    onSelect,
    emoji,
    disabled = false,
}: {
    selected: string | null;
    label?: string;
    onSelect: (value: string | null) => void;
    emoji?: string;
    disabled?: boolean;
}) {
    const COUNTRY_OPTIONS = useMemo(
        () =>
            Object.keys(COUNTRIES).map((code) => ({
                value: code,
                label: <CountryLabel code={code} />,
            })),
        []
    );

    return (
        <div className='relative w-full'>
            {label && (
                <p className='my-4 text-sm font-bold uppercase text-primaryDark md:text-lg'>
                    {label}:
                </p>
            )}
            <div className='mb-4 flex flex-row items-center justify-between'>
                {emoji && <span className='mr-4 text-3xl'>{emoji}</span>}
                <DropdownField
                    options={COUNTRY_OPTIONS}
                    selected={selected}
                    onSelect={onSelect}
                    disabled={disabled}
                />
            </div>
        </div>
    );
}
