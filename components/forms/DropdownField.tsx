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

interface DropdownPagination {
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    autoFetchOnScrollEnd?: boolean;
    showLoadMoreAction?: boolean;
    loadMoreLabel?: string;
    loadingMoreLabel?: string;
}

interface DropdownFieldProps {
    label?: string;
    options: Option[];
    selected: string | string[] | null;
    multiple?: boolean;
    disabled?: boolean;
    placeholder?: string;
    pagination?: DropdownPagination;
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
    pagination,
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

    const handleOptionsScroll = useCallback(
        (event: React.UIEvent<HTMLDivElement>) => {
            if (!pagination?.autoFetchOnScrollEnd) {
                return;
            }

            if (!pagination.hasNextPage || pagination.isFetchingNextPage) {
                return;
            }

            const target = event.currentTarget;
            const nearBottom =
                target.scrollTop + target.clientHeight >=
                target.scrollHeight - 24;

            if (nearBottom) {
                pagination.fetchNextPage();
            }
        },
        [pagination]
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
                        className={`flex min-h-[44px] w-full items-center justify-between rounded-lg border px-4 py-2 text-sm shadow-sm focus:outline-none md:p-4 md:text-lg ${
                            disabled
                                ? 'bg-grey/25 text-grey'
                                : 'text-primary-dark bg-white'
                        }`}
                    >
                        {getSelectedLabel()}
                        <FaChevronDown className='ml-2 h-4 w-4' />
                    </ListboxButton>

                    <ListboxOptions
                        anchor='bottom start'
                        onScroll={handleOptionsScroll}
                        className='z-50 mt-1 max-h-60 w-[var(--button-width)] overflow-auto rounded-lg border bg-white text-sm shadow-lg [--anchor-max-height:240px] focus:outline-none'
                    >
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
                        {pagination?.showLoadMoreAction &&
                            pagination.hasNextPage && (
                                <button
                                    type='button'
                                    className='text-primary-dark hover:bg-primary-light/40 w-full cursor-pointer px-4 py-2 text-left text-sm font-semibold'
                                    onMouseDown={(event) =>
                                        event.preventDefault()
                                    }
                                    onClick={() => pagination.fetchNextPage()}
                                    disabled={pagination.isFetchingNextPage}
                                >
                                    {pagination.isFetchingNextPage
                                        ? (pagination.loadingMoreLabel ??
                                          txt.loading)
                                        : (pagination.loadMoreLabel ??
                                          txt.loadMore)}
                                </button>
                            )}
                    </ListboxOptions>
                </div>
            </Listbox>
        </div>
    );
}

export default React.memo(DropdownField);
