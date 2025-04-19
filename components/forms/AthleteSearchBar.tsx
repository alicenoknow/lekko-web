'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAthletes, fetchDisciplines } from '@/app/api/typer';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import FormField from '@/components/forms/FormField';
import { txt } from '@/nls/texts';
import DropdownPillFilter from './DropdownPillFilter';
import CountryLabel from './CountryLabel';
import { COUNTRIES } from '@/lib/Countries';
import AthleteLabel from './AthleteLabel';

// TODO jumping forms
// TODO answers fetching
// TODO athletes paging
// TODO verify everything

interface Props {
    selected: number | null;
    label?: string;
    onSelect: (athleteId: number | null) => void;
}

export default function AthleteSearchBar({ selected, label, onSelect }: Props) {
    const { token } = usePrivateUserContext();
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [disciplines, setDisciplines] = useState<string[]>([]);
    const [country, setCountry] = useState<string | null>(null);
    const [gender, setGender] = useState<string | null>(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => clearTimeout(handler);
    }, [search]);

    const { data: athletesData } = useQuery({
        queryKey: ['athletes', debouncedSearch, disciplines, country, gender],
        queryFn: () =>
            fetchAthletes(debouncedSearch, token, disciplines, country, gender),
        enabled: !!token && !!debouncedSearch,
    });

    const { data: allDisciplines } = useQuery({
        queryKey: ['disciplines'],
        queryFn: () => fetchDisciplines(token),
        enabled: !!token,
    });

    // TODO athletes paging aa
    const athletes = athletesData?.data ?? [];

    return (
        <div className='relative w-full'>
            {label && (
                <p className='my-4 text-sm font-bold uppercase text-primaryDark md:text-lg'>
                    {label}:
                </p>
            )}
            {selected ? (
                <div className='mb-4 flex items-center justify-between border bg-white p-2 text-sm text-primaryDark md:p-4 md:text-lg'>
                    <AthleteLabel selected={selected} />
                    <button
                        onClick={() => onSelect(null)}
                        className='text-md font-semibold uppercase text-accentDark'
                    >
                        {txt.forms.change}
                    </button>
                </div>
            ) : (
                <>
                    <div className='mb-4 flex flex-row gap-4'>
                        {allDisciplines?.data && (
                            <DropdownPillFilter
                                label={txt.forms.discipline}
                                options={allDisciplines.data.map((d) => ({
                                    value: d.id.toString(),
                                    label: d.name,
                                }))}
                                selected={disciplines}
                                onSelect={setDisciplines}
                                multiple
                            />
                        )}
                        <DropdownPillFilter
                            label={txt.forms.country}
                            options={Object.keys(COUNTRIES).map((code) => ({
                                value: code,
                                label: <CountryLabel code={code} />,
                            }))}
                            selected={country}
                            onSelect={setCountry}
                        />
                        <DropdownPillFilter
                            label={txt.forms.gender}
                            options={[
                                { value: 'man', label: txt.forms.male },
                                { value: 'woman', label: txt.forms.female },
                            ]}
                            selected={gender}
                            onSelect={setGender}
                        />
                    </div>
                    <div className='relative'>
                        <FormField
                            id='search-athlete'
                            type='text'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            required={false}
                            placeholder={txt.searchText}
                        />
                        {athletes.length > 0 && (
                            <div className='absolute left-0 top-full z-[999] mt-1 max-h-48 w-full overflow-y-auto rounded border bg-white shadow-lg'>
                                {athletes.map((athlete) => (
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
                </>
            )}
        </div>
    );
}
