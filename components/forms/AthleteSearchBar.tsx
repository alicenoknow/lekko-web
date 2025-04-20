'use client';

import { useEffect, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import FormField from '@/components/forms/FormField';
import { txt } from '@/nls/texts';
import AthleteLabel from './AthleteLabel';
import AthleteSearchFilter from './AthleteSearchFilter';
import { fetchAthletes } from '@/app/api/athletes';

interface Props {
    selected: number | null;
    label?: string;
    emoji?: string;
    disciplines?: string[];
    country?: string | null;
    gender?: string | null;
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

    const debouncedSearch = useDebouncedValue(search, 500);

    const { data: athletesData } = useQuery({
        queryKey: ['athletes', debouncedSearch, disciplines, country, gender],
        queryFn: () =>
            fetchAthletes(debouncedSearch, token, disciplines, country, gender),
        enabled: !!token && !!debouncedSearch,
    });

    const athleteOptions = useMemo(
        () => athletesData?.data ?? [],
        [athletesData]
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
                            onDisciplinesChanged={setDisciplines}
                            onCountryChanged={setCountry}
                            onGenderChanged={setGender}
                        />

                        <FormField
                            id='search-athlete'
                            type='text'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            required={false}
                            placeholder={txt.searchText}
                            emoji={emoji}
                        />

                        {athleteOptions.length > 0 && (
                            <div className='absolute left-0 top-full z-[999] mt-1 max-h-48 w-full overflow-y-auto border bg-white shadow-lg'>
                                {athleteOptions.map((athlete) => (
                                    <div
                                        key={athlete.id}
                                        onClick={() => {
                                            onSelect(athlete.id);
                                            setSearch('');
                                        }}
                                        className='cursor-pointer p-2 hover:bg-gray-100'
                                    >
                                        {athlete.first_name} {athlete.last_name}{' '}
                                        ({athlete.country})
                                    </div>
                                ))}
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

// TODO paging athletes
// TODO paging in general
// TODO refactor components
// TODO test
// TODO points input zero
// TODO answers impl
// TODO ranking impl
