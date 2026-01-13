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
    placeholder?: string;
    onSelect: ((value: string | null) => void) | ((value: string[]) => void);
}

const NO_SELECTION = '__NO_SELECTION__';

function DropdownField({
    label,
    options,
    selected,
    placeholder = txt.forms.select,
    multiple = false,
    disabled = false,
    onSelect,
}: DropdownFieldProps) {
    const internalValue = useCallback(() => {
        if (multiple) return selected as string[];
        return selected === null ? NO_SELECTION : (selected as string);
    }, [selected, multiple]);

    const getSelectedLabel = () => {
        if (Array.isArray(selected)) {
            return selected.length
                ? `${txt.forms.selected} ${selected.length}`
                : txt.forms.select;
        }

        return options.find((o) => o.value === selected)?.label ?? placeholder;
    };

    const handleSelectionChange = useCallback(
        (newValue: string | string[]) => {
            if (multiple) {
                (onSelect as (value: string[]) => void)(newValue as string[]);
            } else {
                const singleValue =
                    newValue === NO_SELECTION ? null : (newValue as string);
                (onSelect as (value: string | null) => void)(singleValue);
            }
        },
        [multiple, onSelect]
    );

    return (
        <div className='flex w-full flex-col gap-1'>
            {label && (
                <span className='md:text-md text-primary-dark text-sm font-bold uppercase'>
                    {label}
                </span>
            )}
            <Listbox
                value={internalValue()}
                onChange={handleSelectionChange}
                multiple={multiple}
                disabled={disabled}
            >
                <div className='relative inline-block w-full text-left'>
                    <ListboxButton
                        className={`flex w-full items-center justify-between border px-4 py-2 text-sm shadow-sm focus:outline-none md:p-4 md:text-lg ${
                            disabled
                                ? 'bg-light-gray/25 text-light-gray'
                                : 'text-primary-dark bg-white'
                        }`}
                    >
                        {getSelectedLabel()}
                        <FaChevronDown className='ml-2 h-4 w-4' />
                    </ListboxButton>

                    <ListboxOptions className='absolute z-50 mt-1 max-h-60 w-full overflow-auto border bg-white text-sm shadow-lg focus:outline-none'>
                        <ListboxOption
                            key='none'
                            value={NO_SELECTION}
                            className='cursor-pointer px-4 py-2'
                        >
                            {({ selected }) => (
                                <div className='flex items-center justify-between'>
                                    <span>{placeholder}</span>
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
            </Listbox>
        </div>
    );
}

export default React.memo(DropdownField);
