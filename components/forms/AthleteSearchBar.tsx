'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { useDebounce } from '@/hooks/useDebounce';
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
    disabled?: boolean;
    showPlaceholder?: boolean;
}

export default function AthleteSearchBar({
    selected,
    label,
    emoji,
    onSelect,
    excludeIds = [],
    disabled = false,
    showPlaceholder = true,
}: Props) {
    const { token } = useAuthenticatedUser();
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [disciplines, setDisciplines] = useState<string[]>([]);
    const [country, setCountry] = useState<string | null>(null);
    const [gender, setGender] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('touchstart', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('touchstart', handleOutsideClick);
        };
    }, []);

    const hasActiveCriteria =
        !!debouncedSearch || disciplines.length > 0 || !!country || !!gender;

    const {
        data,
        isError,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteQuery({
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
        getNextPageParam: (lastPage) =>
            lastPage.pagination_info.next_page ?? undefined,
        enabled: !!token && hasActiveCriteria,
        staleTime: 60 * 60 * 1000,
    });
    const athletes = useMemo(
        () => data?.pages.flatMap((p) => p.data) ?? [],
        [data]
    );

    const allExcludeIds = useMemo(
        () => (selected ? [selected, ...excludeIds] : excludeIds),
        [selected, excludeIds]
    );

    const visibleAthletes = useMemo(
        () => athletes.filter((a) => !allExcludeIds.includes(a.id)),
        [athletes, allExcludeIds]
    );

    const handleAthleteSelect = (athleteId: number) => {
        onSelect(athleteId);
        setSearch('');
        setIsOpen(false);
        searchInputRef.current?.blur();
    };

    return (
        <div ref={containerRef} className='relative flex w-full flex-col gap-3'>
            {label && (
                <p className='md:text-md text-primary-dark mb-2 text-sm font-bold uppercase'>
                    {label}:
                </p>
            )}
            <div className={`w-full${disabled ? ' pointer-events-none opacity-50' : ''}`}>
                <AthleteSearchFilter
                    disciplines={disciplines}
                    country={country}
                    gender={gender}
                    onDisciplinesChanged={setDisciplines}
                    onCountryChanged={setCountry}
                    onGenderChanged={setGender}
                />
                <p className='text-grey mb-4 text-xs'>{txt.forms.filterHint}</p>
                <div className='relative'>
                    <FormField
                        id='search-athlete'
                        type='text'
                        value={search}
                        inputRef={searchInputRef}
                        onFocus={() => setIsOpen(true)}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setIsOpen(true);
                        }}
                        required={false}
                        placeholder={txt.searchText}
                        emoji={emoji}
                    />
                    {isOpen && hasActiveCriteria && visibleAthletes.length > 0 && (
                        <div
                            className='absolute left-0 right-0 z-50 max-h-60 overflow-y-auto rounded-lg border bg-white shadow-lg'
                            onScroll={(e) => {
                                if (!hasNextPage || isFetchingNextPage) return;
                                const el = e.currentTarget;
                                if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
                                    void fetchNextPage();
                                }
                            }}
                        >
                            {visibleAthletes.map((athlete) => (
                                <button
                                    key={athlete.id}
                                    type='button'
                                    className='hover:bg-primary-light/40 w-full px-4 py-2 text-left'
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => handleAthleteSelect(athlete.id)}
                                >
                                    <InnerAthleteLabel athlete={athlete} />
                                </button>
                            ))}
                            {isFetchingNextPage && (
                                <p className='text-grey px-4 py-2 text-sm'>{txt.loading}</p>
                            )}
                        </div>
                    )}
                    {isError && (
                        <p className='text-dark-red mt-1 text-xs'>{txt.fetchErrorText}</p>
                    )}
                </div>
            </div>
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
            ) : showPlaceholder ? (
                <div className='border-light-gray flex min-h-[52px] items-center gap-3 rounded-lg border-2 border-dashed px-3 py-2 opacity-40'>
                    {emoji && <span className='text-2xl'>{emoji}</span>}
                    <div className='border-light-gray flex-1 border-t-2 border-dashed' />
                </div>
            ) : null}
        </div>
    );
}
