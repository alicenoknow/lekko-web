'use client';

import { useMemo } from 'react';
import { COUNTRIES } from '@/lib/countries';
import { txt } from '@/nls/texts';
import { useQuery } from '@tanstack/react-query';
import CountryLabel from './CountryLabel';
import DropdownPillFilter from './DropdownPillFilter';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import { fetchDisciplines } from '@/app/api/disciplines';
import MultipleDropdownPillFilter from './MultipleDropdownPillFilter';

interface Props {
    disciplines: string[];
    country: string | null;
    gender: string | null;
    onDisciplinesChanged: (value: string[]) => void;
    onCountryChanged: (value: string | null) => void;
    onGenderChanged: (value: string | null) => void;
}

export default function AthleteSearchFilter({
    disciplines,
    country,
    gender,
    onDisciplinesChanged,
    onCountryChanged,
    onGenderChanged,
}: Props) {
    const { token } = usePrivateUserContext();

    const { data: allDisciplines } = useQuery({
        queryKey: ['disciplines'],
        queryFn: () => fetchDisciplines(token),
        enabled: !!token,
        staleTime: 60 * 60 * 1000,
    });

    const countryOptions = useMemo(
        () =>
            Object.keys(COUNTRIES).map((code) => ({
                value: code,
                label: <CountryLabel code={code} />,
            })),
        []
    );

    const genderOptions = useMemo(
        () => [
            { value: 'man', label: txt.forms.male },
            { value: 'woman', label: txt.forms.female },
        ],
        []
    );

    return (
        <div className='mb-4 flex flex-row gap-2'>
            {allDisciplines?.data && (
                <MultipleDropdownPillFilter
                    label={txt.forms.discipline}
                    options={allDisciplines.data.map((d) => ({
                        value: d.id.toString(),
                        label: d.name,
                    }))}
                    selected={disciplines}
                    onSelect={onDisciplinesChanged}
                />
            )}
            <DropdownPillFilter
                label={txt.forms.country}
                options={countryOptions}
                selected={country}
                onSelect={onCountryChanged}
            />
            <DropdownPillFilter
                label={txt.forms.gender}
                options={genderOptions}
                selected={gender}
                onSelect={onGenderChanged}
            />
        </div>
    );
}
