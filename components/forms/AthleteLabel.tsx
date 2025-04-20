'use client';

import { useQuery } from '@tanstack/react-query';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import CountryLabel from './CountryLabel';
import { fetchAthleteById } from '@/app/api/athletes';
import React from 'react';

interface Props {
    selected: number | null;
    label?: string;
    emoji?: string;
}

function AthleteLabel({ selected, label, emoji }: Props) {
    const { token } = usePrivateUserContext();

    const shouldFetch = !!token && !!selected;

    const { data: athlete } = useQuery({
        queryKey: ['athlete', selected ?? 'none'],
        queryFn: () => fetchAthleteById(selected!, token),
        enabled: shouldFetch,
    });

    if (!shouldFetch || !athlete) return null;

    return (
        <div className='my-2 flex flex-col gap-2'>
            {label && (
                <p className='md:text-md text-sm font-bold uppercase text-primaryDark'>
                    {label}:
                </p>
            )}
            <div className='flex items-center gap-2 text-lg uppercase'>
                {emoji && <span className='text-3xl'>{emoji}</span>}
                <strong>
                    {athlete.first_name} {athlete.last_name}
                </strong>
                <CountryLabel code={athlete.country ?? ''} />
            </div>
        </div>
    );
}

export default React.memo(AthleteLabel);
