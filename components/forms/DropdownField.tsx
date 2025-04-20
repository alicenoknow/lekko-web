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

interface DropdownFieldProps {
    label?: string;
    options: Option[];
    selected: string | string[] | null;
    multiple?: boolean;
    disabled?: boolean;
    onSelect: ((value: string | null) => void) | ((value: string[]) => void);
}

export default function DropdownField({
    label,
    options,
    selected,
    multiple = false,
    disabled = false,
    onSelect,
}: DropdownFieldProps) {
    const selectedLabel = Array.isArray(selected)
        ? selected.length === 0
            ? txt.forms.select
            : ` ${txt.forms.selected} ${selected.length}`
        : (options.find((o) => o.value === selected)?.label ??
          txt.forms.select);

    return (
        <div className='flex w-full flex-col gap-1'>
            {label && (
                <span className='md:text-md mr-12 text-sm font-bold uppercase text-primaryDark'>
                    {label}
                </span>
            )}
            <Listbox
                value={selected}
                onChange={onSelect}
                multiple={multiple}
                disabled={disabled}
            >
                <div className='relative inline-block text-left'>
                    <ListboxButton className='flex w-full items-center justify-between border bg-white px-4 py-2 text-sm text-primaryDark shadow-sm focus:outline-none md:p-4 md:text-lg'>
                        {selectedLabel}
                        <FaChevronDown className='ml-2 h-4 w-4' />
                    </ListboxButton>
                    <ListboxOptions className='absolute z-50 mt-1 max-h-60 w-full overflow-auto border bg-white text-sm text-primaryDark shadow-lg focus:outline-none md:p-4 md:text-lg'>
                        <ListboxOption
                            key='select'
                            value={undefined}
                            className='cursor-pointer px-4 py-2'
                        >
                            {({ selected }) => (
                                <div className='flex items-center justify-between'>
                                    <span>{txt.forms.select}</span>
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
