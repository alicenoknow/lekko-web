'use client';

import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from '@headlessui/react';
import { FaChevronDown, FaCheck } from 'react-icons/fa';
import { txt } from '@/nls/texts';
import React, { useCallback } from 'react';

export interface Option {
    label: React.ReactNode;
    value: string;
}

interface Props {
    label?: string;
    options: Option[];
    selected: string | null;
    disabled?: boolean;
    onSelect: (value: string | null) => void;
}

const NO_SELECTION = '__NO_SELECTION__';

function DropdownPillFilter({
    label,
    options,
    selected,
    disabled = false,
    onSelect,
}: Props) {
    const internalValue = selected ?? NO_SELECTION;

    const getLabel = (): React.ReactNode => {
        return (
            options.find((o) => o.value === selected)?.label ?? txt.forms.all
        );
    };

    const handleChange = useCallback(
        (value: string) => {
            onSelect(value === NO_SELECTION ? null : value);
        },
        [onSelect]
    );

    return (
        <div className='flex w-full flex-col gap-1'>
            {label && <span className='text-sm font-semibold'>{label}</span>}

            <Listbox
                value={internalValue}
                onChange={handleChange}
                disabled={disabled}
            >
                {({ open }) => (
                    <div className='relative inline-block w-full text-left'>
                        <ListboxButton
                            className={`flex min-h-12 w-full items-center justify-between border px-4 py-2 text-sm shadow-sm focus:outline-none ${
                                disabled
                                    ? 'text-light-gray cursor-not-allowed bg-gray-100'
                                    : 'bg-white'
                            }`}
                        >
                            {getLabel()}
                            <FaChevronDown className='ml-2 h-4 w-4' />
                        </ListboxButton>
                        <ListboxOptions className='absolute z-50 mt-1 max-h-60 w-full overflow-auto border bg-white text-sm shadow-lg focus:outline-none'>
                            <ListboxOption
                                value={NO_SELECTION}
                                key='all'
                                className='cursor-pointer px-4 py-2'
                            >
                                {({ selected }) => (
                                    <div className='flex items-center justify-between'>
                                        <span>{txt.forms.all}</span>
                                        {selected && (
                                            <FaCheck className='text-primary-dark h-4 w-4' />
                                        )}
                                    </div>
                                )}
                            </ListboxOption>
                            {options.map(({ value, label }) => (
                                <ListboxOption
                                    key={value}
                                    value={value}
                                    className='cursor-pointer px-4 py-2 capitalize'
                                >
                                    {({ selected }) => (
                                        <div className='flex items-center justify-between'>
                                            <span>{label}</span>
                                            {selected && (
                                                <FaCheck className='text-primary-dark h-4 w-4' />
                                            )}
                                        </div>
                                    )}
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </div>
                )}
            </Listbox>
        </div>
    );
}

export default React.memo(DropdownPillFilter);
