'use client';

import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from '@headlessui/react';
import { FaChevronDown, FaCheck } from 'react-icons/fa';
import React from 'react';
import { txt } from '@/nls/texts';

interface Option {
    label: React.ReactNode;
    value: string;
}

interface DropdownPillFilterProps {
    label?: string;
    options: Option[];
    selected: string | string[] | null;
    multiple?: boolean;
    disabled?: boolean;
    onSelect: ((value: string | null) => void) | ((value: string[]) => void);
}

export default function DropdownPillFilter({
    label,
    options,
    selected,
    multiple = false,
    onSelect,
}: DropdownPillFilterProps) {
    const selectedLabel = Array.isArray(selected)
        ? selected.length === 0
            ? txt.forms.all
            : ` ${txt.forms.selected} ${selected.length}`
        : (options.find((o) => o.value === selected)?.label ?? txt.forms.all);

    return (
        <div className='flex w-full flex-col gap-1'>
            {label && <span className='text-sm font-semibold'>{label}</span>}
            <Listbox value={selected} onChange={onSelect} multiple={multiple}>
                <div className='relative inline-block text-left'>
                    <ListboxButton className='flex w-full items-center justify-between border bg-white px-4 py-2 text-sm shadow-sm focus:outline-none'>
                        {selectedLabel}
                        <FaChevronDown className='ml-2 h-4 w-4' />
                    </ListboxButton>
                    <ListboxOptions className='absolute z-50 mt-1 max-h-60 w-full overflow-auto border bg-white text-sm shadow-lg focus:outline-none'>
                        <ListboxOption
                            key='all'
                            value={undefined}
                            className='cursor-pointer px-4 py-2'
                        >
                            {({ selected }) => (
                                <div className='flex items-center justify-between'>
                                    <span>{txt.forms.all}</span>
                                    {selected && (
                                        <FaCheck className='h-4 w-4 text-primaryDark' />
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
                                            <FaCheck className='h-4 w-4 text-primaryDark' />
                                        )}
                                    </div>
                                )}
                            </ListboxOption>
                        ))}
                    </ListboxOptions>
                </div>
            </Listbox>
        </div>
    );
}
