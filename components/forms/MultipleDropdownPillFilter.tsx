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
    selected: string[];
    disabled?: boolean;
    onSelect: (value: string[]) => void;
}

function MultipleDropdownPillFilter({
    label,
    options,
    selected,
    disabled = false,
    onSelect,
}: Props) {
    const handleSelect = useCallback(
        (value: string[]) => {
            if (value.some((v) => v === undefined)) {
                onSelect([]);
                return;
            }
            onSelect(value);
        },
        [onSelect]
    );

    const selectedLabels = options
        .filter((opt) => selected.includes(opt.value))
        .map((opt) => opt.label);

    return (
        <div className='flex w-full flex-col gap-1'>
            {label && <span className='text-sm font-semibold'>{label}</span>}
            <Listbox
                value={selected}
                onChange={handleSelect}
                disabled={disabled}
                multiple
            >
                <div className='relative inline-block w-full text-left'>
                    <ListboxButton
                        className={`flex min-h-[44px] w-full flex-wrap items-center justify-between gap-2 rounded-md border px-4 py-2 text-sm shadow-sm focus:outline-none ${
                            disabled
                                ? 'cursor-not-allowed bg-lightGray/25 text-lightGray'
                                : 'bg-white'
                        }`}
                    >
                        <div className='flex flex-wrap items-center gap-2 overflow-hidden'>
                            {selected.length > 0 ? (
                                selectedLabels.map((label, idx) => (
                                    <span
                                        key={idx}
                                        className='whitespace-nowrap rounded-full bg-primaryLight px-2 py-1 text-xs font-semibold text-primaryDark'
                                    >
                                        {label}
                                    </span>
                                ))
                            ) : (
                                <span>{txt.forms.all}</span>
                            )}
                        </div>
                        <FaChevronDown className='ml-auto h-4 w-4 shrink-0' />
                    </ListboxButton>
                    <ListboxOptions className='absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white text-sm shadow-lg focus:outline-none'>
                        <ListboxOption
                            value={undefined}
                            key='all'
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

export default React.memo(MultipleDropdownPillFilter);
