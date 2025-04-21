'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import FormField from '@/components/forms/FormField';
import { txt } from '@/nls/texts';
import AthleteLabel from './AthleteLabel';
import AthleteSearchFilter from './AthleteSearchFilter';
import { fetchAthletes } from '@/app/api/athletes';
import { Athlete } from '@/types/athletes';

interface Props {
    selected: number | null;
    label?: string;
    emoji?: string;
    onSelect: (athleteId: number | null) => void;
}

export default function AthleteSearchBar({
    selected,
    label,
    emoji,
    onSelect,
}: Props) {
    const { token } = usePrivateUserContext();
    const [search, setSearch] = useState('');
    const [disciplines, setDisciplines] = useState<string[]>([]);
    const [country, setCountry] = useState<string | null>(null);
    const [gender, setGender] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [athletes, setAthletes] = useState<Athlete[]>([]);
    const [hasMore, setHasMore] = useState(true);

    const debouncedSearch = useDebouncedValue(search, 500);

    const { data: athletesData, isFetching } = useQuery({
        queryKey: [
            'athletes',
            debouncedSearch,
            disciplines,
            country,
            gender,
            page,
        ],
        queryFn: () =>
            fetchAthletes(
                debouncedSearch,
                token,
                disciplines,
                country,
                gender,
                page
            ),
        enabled: !!token && !!debouncedSearch,
        staleTime: 60 * 60 * 1000,
    });

    useEffect(() => {
        if (!athletesData) return;

        if (page === 1) {
            setAthletes(athletesData.data);
        } else {
            setAthletes((prev) => [...prev, ...athletesData.data]);
        }

        setHasMore(!athletesData.pagination_info?.is_last_page);
    }, [athletesData, page]);

    const dropdownOptions = useMemo(
        () =>
            athletes.map((athlete) => (
                <div
                    key={athlete.id}
                    onClick={() => {
                        onSelect(athlete.id);
                        setSearch('');
                    }}
                    className='cursor-pointer p-2 hover:bg-accentLight'
                >
                    {athlete.first_name} {athlete.last_name} ({athlete.country})
                </div>
            )),
        [athletes, onSelect]
    );

    return (
        <div className='relative flex w-full flex-row justify-center gap-2'>
            <div className='w-full'>
                {label && (
                    <p className='md:text-md mb-2 text-sm font-bold uppercase text-primaryDark'>
                        {label}:
                    </p>
                )}

                {selected ? (
                    <div className='mb-4 flex items-center justify-between border bg-white px-2 text-sm text-primaryDark md:px-4 md:py-2 md:text-lg'>
                        <AthleteLabel emoji={emoji} selected={selected} />
                        <button
                            onClick={() => onSelect(null)}
                            className='text-md font-semibold uppercase text-accentDark'
                        >
                            {txt.forms.change}
                        </button>
                    </div>
                ) : (
                    <div className='w-full'>
                        <AthleteSearchFilter
                            disciplines={disciplines}
                            country={country}
                            gender={gender}
                            onDisciplinesChanged={(val) => {
                                setDisciplines(val);
                                setPage(1);
                            }}
                            onCountryChanged={(val) => {
                                setCountry(val);
                                setPage(1);
                            }}
                            onGenderChanged={(val) => {
                                setGender(val);
                                setPage(1);
                            }}
                        />

                        <FormField
                            id='search-athlete'
                            type='text'
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            required={false}
                            placeholder={txt.searchText}
                            emoji={emoji}
                        />

                        {athletes.length > 0 && (
                            <div className='absolute left-0 top-full z-[999] mt-1 max-h-60 w-full overflow-y-auto border bg-white shadow-lg'>
                                {dropdownOptions}
                                {hasMore && (
                                    <button
                                        className='w-full p-2 text-sm font-semibold text-primaryDark hover:bg-accentLight'
                                        onClick={() => setPage((p) => p + 1)}
                                        disabled={isFetching}
                                    >
                                        {isFetching
                                            ? txt.loading
                                            : txt.loadMore}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
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

// TODO ranking impl
// TODO handle mutations errors
// TODO caching
// TODO typing answer/question content
// TODO test all
