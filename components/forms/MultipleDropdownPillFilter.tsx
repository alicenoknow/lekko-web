'use client';

import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from '@headlessui/react';
import { FaChevronDown, FaCheck, FaTimes } from 'react-icons/fa';
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

    const selectedOptions = options.filter((opt) =>
        selected.includes(opt.value)
    );

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
                        className={`flex min-h-12 w-full items-center justify-between gap-2 rounded-lg border px-2 py-2 text-sm shadow-sm focus:outline-none ${
                            disabled
                                ? 'bg-grey/25 text-grey cursor-not-allowed'
                                : 'bg-white'
                        }`}
                    >
                        <div className='flex flex-wrap items-center gap-2 overflow-hidden'>
                            {selected.length > 0 ? (
                                selectedOptions.map((opt) => (
                                    <span
                                        key={opt.value}
                                        className='bg-primary-light text-primary-dark flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold whitespace-nowrap'
                                    >
                                        {opt.label}
                                        <span
                                            role='button'
                                            tabIndex={0}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelect(
                                                    selected.filter(
                                                        (v) => v !== opt.value
                                                    )
                                                );
                                            }}
                                            onKeyDown={(e) => {
                                                if (
                                                    e.key === 'Enter' ||
                                                    e.key === ' '
                                                ) {
                                                    e.stopPropagation();
                                                    onSelect(
                                                        selected.filter(
                                                            (v) =>
                                                                v !== opt.value
                                                        )
                                                    );
                                                }
                                            }}
                                            className='hover:text-dark-red ml-1 cursor-pointer'
                                        >
                                            <FaTimes className='h-3 w-3' />
                                        </span>
                                    </span>
                                ))
                            ) : (
                                <span>{txt.forms.all}</span>
                            )}
                        </div>
                        <FaChevronDown className='ml-auto h-4 w-4 shrink-0' />
                    </ListboxButton>
                    <ListboxOptions
                        anchor='bottom start'
                        className='z-50 mt-1 max-h-60 w-[var(--button-width)] overflow-auto rounded-lg border bg-white text-sm shadow-lg [--anchor-max-height:240px] focus:outline-none'
                    >
                        <ListboxOption
                            value={undefined}
                            key='all'
                            className='cursor-pointer rounded px-4 py-2'
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
                                className='cursor-pointer rounded px-4 py-2 capitalize'
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
            </Listbox>
        </div>
    );
}

export default React.memo(MultipleDropdownPillFilter);
