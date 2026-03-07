'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import FormField from '@/components/forms/FormField';
import { txt } from '@/nls/texts';
import AthleteLabel, { InnerAthleteLabel } from './AthleteLabel';
import AthleteSearchFilter from './AthleteSearchFilter';
import { fetchAthletes } from '@/lib/api/athletes';
import { FaTimes } from 'react-icons/fa';

interface Props {
    selected: number | null;
    label?: string;
    emoji?: string;
    onSelect: (athleteId: number | null) => void;
    excludeIds?: number[];
    showSelectedBelow?: boolean;
    disabled?: boolean;
}

export default function AthleteSearchBar({
    selected,
    label,
    emoji,
    onSelect,
    excludeIds = [],
    showSelectedBelow = false,
    disabled = false,
}: Props) {
    const { token } = useAuthenticatedUser();
    const [search, setSearch] = useState('');
    const [disciplines, setDisciplines] = useState<string[]>([]);
    const [country, setCountry] = useState<string | null>(null);
    const [gender, setGender] = useState<string | null>(null);
    const [inputFocused, setInputFocused] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const [dropdownRect, setDropdownRect] = useState<DOMRect | null>(null);
    const debouncedSearch = useDebouncedValue(search, 500);

    const { data, isFetchingNextPage, hasNextPage, fetchNextPage } =
        useInfiniteQuery({
            queryKey: [
                'athletes',
                debouncedSearch,
                disciplines,
                country,
                gender,
            ],
            queryFn: ({ pageParam }) =>
                fetchAthletes(
                    debouncedSearch,
                    token,
                    disciplines,
                    country,
                    gender,
                    pageParam
                ),
            initialPageParam: 1,
            getNextPageParam: (lastPage) => {
                const totalPages = Math.ceil(
                    lastPage.total_count / lastPage.limit
                );
                return lastPage.page < totalPages
                    ? lastPage.page + 1
                    : undefined;
            },
            enabled:
                !!token &&
                (!!debouncedSearch ||
                    disciplines.length > 0 ||
                    !!country ||
                    !!gender),
            staleTime: 60 * 60 * 1000,
        });

    const athletes = useMemo(
        () => data?.pages.flatMap((p) => p.data) ?? [],
        [data]
    );

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                searchInputRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !searchInputRef.current.contains(event.target as Node)
            ) {
                setInputFocused(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (inputFocused && searchContainerRef.current) {
            setDropdownRect(searchContainerRef.current.getBoundingClientRect());
        }
    }, [inputFocused]);

    const allExcludeIds = useMemo(
        () => (selected ? [selected, ...excludeIds] : excludeIds),
        [selected, excludeIds]
    );

    const visibleAthletes = useMemo(
        () =>
            showSelectedBelow
                ? athletes.filter((a) => !allExcludeIds.includes(a.id))
                : athletes,
        [athletes, allExcludeIds, showSelectedBelow]
    );

    const dropdownOptions = useMemo(
        () =>
            visibleAthletes.map((athlete) => (
                <button
                    key={athlete.id}
                    onClick={() => {
                        onSelect(athlete.id);
                        setSearch('');
                        setInputFocused(false);
                    }}
                    className='hover:bg-accent-light w-full cursor-pointer rounded-lg p-2 text-left'
                >
                    <InnerAthleteLabel athlete={athlete} />
                </button>
            )),
        [visibleAthletes, onSelect]
    );

    const searchSection = (
        <div
            ref={searchContainerRef}
            className={`w-full${disabled ? 'pointer-events-none opacity-50' : ''}`}
        >
            <AthleteSearchFilter
                disciplines={disciplines}
                country={country}
                gender={gender}
                onDisciplinesChanged={setDisciplines}
                onCountryChanged={setCountry}
                onGenderChanged={setGender}
            />
            <p className='text-grey mb-4 text-xs'>{txt.forms.filterHint}</p>
            <FormField
                id='search-athlete'
                type='text'
                value={search}
                inputRef={searchInputRef}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setTimeout(() => setInputFocused(false), 150)}
                onChange={(e) => setSearch(e.target.value)}
                required={false}
                placeholder={txt.searchText}
                emoji={emoji}
            />

            {!disabled &&
                visibleAthletes.length > 0 &&
                inputFocused &&
                dropdownRect &&
                createPortal(
                    <div
                        ref={dropdownRef}
                        onScroll={(e) => {
                            if (isFetchingNextPage || !hasNextPage) return;
                            const el = e.currentTarget;
                            if (
                                el.scrollHeight - el.scrollTop <=
                                el.clientHeight + 40
                            ) {
                                fetchNextPage();
                            }
                        }}
                        style={{
                            position: 'fixed',
                            top: dropdownRect.bottom + 4,
                            left: dropdownRect.left,
                            width: dropdownRect.width,
                            zIndex: 9999,
                        }}
                        className='max-h-60 overflow-y-auto rounded-lg border bg-white shadow-lg'
                    >
                        {dropdownOptions}
                        {isFetchingNextPage && (
                            <div className='text-grey py-1 text-center text-xs'>
                                {txt.loading}
                            </div>
                        )}
                    </div>,
                    document.body
                )}
        </div>
    );

    // Legacy behavior (used by admin components): selected replaces search bar
    if (!showSelectedBelow) {
        return (
            <div className='relative flex w-full flex-row justify-center gap-2'>
                <div className='w-full'>
                    {label && (
                        <p className='md:text-md text-primary-dark mb-2 text-sm font-bold uppercase'>
                            {label}:
                        </p>
                    )}
                    {selected ? (
                        <div className='text-primary-dark mb-4 flex items-center justify-between rounded-lg border bg-white px-2 text-sm md:px-4 md:py-2 md:text-lg'>
                            <AthleteLabel
                                {...(emoji !== undefined ? { emoji } : {})}
                                selected={selected}
                            />
                            <button
                                onClick={() => onSelect(null)}
                                className='text-md text-accent-dark font-semibold uppercase'
                            >
                                {txt.forms.change}
                            </button>
                        </div>
                    ) : (
                        searchSection
                    )}
                </div>
            </div>
        );
    }

    // New behavior: search bar always visible, selected shown below
    return (
        <div className='relative flex w-full flex-col gap-3'>
            {label && (
                <p className='md:text-md text-primary-dark mb-2 text-sm font-bold uppercase'>
                    {label}:
                </p>
            )}
            {searchSection}
            {selected ? (
                <div className='text-primary-dark flex min-h-[52px] items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm md:text-lg'>
                    <AthleteLabel
                        {...(emoji !== undefined ? { emoji } : {})}
                        selected={selected}
                        compact
                    />
                    <button
                        onClick={() => onSelect(null)}
                        className='text-grey hover:text-dark-red ml-2 flex-shrink-0'
                        aria-label='Remove'
                    >
                        <FaTimes />
                    </button>
                </div>
            ) : (
                <div className='border-light-gray flex min-h-[52px] items-center rounded-lg border-2 border-dashed px-3 py-2 opacity-40' />
            )}
        </div>
    );
}

function useDebouncedValue<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timeout = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timeout);
    }, [value, delay]);
    return debounced;
}
