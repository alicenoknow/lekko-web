'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import CountryLabel from './CountryLabel';
import { fetchAthleteById } from '@/lib/api/athletes';
import React from 'react';
import { Athlete } from '@/types/athletes';

interface Props {
    selected: number | null;
    label?: string;
    emoji?: string;
}

function AthleteLabel({ selected, label, emoji }: Props) {
    const { token } = useAuthenticatedUser();

    const shouldFetch = !!token && !!selected;

    const { data: athlete } = useQuery({
        queryKey: ['athlete', selected ?? 'none'],
        queryFn: () => fetchAthleteById(selected!, token),
        enabled: shouldFetch,
        staleTime: 60 * 60 * 1000,
    });

    if (!shouldFetch || !athlete) return null;

    return (
        <div className='my-2 flex flex-col gap-2'>
            {label && (
                <p className='md:text-md text-primary-dark text-sm font-bold uppercase'>
                    {label}:
                </p>
            )}
            <InnerAthleteLabel athlete={athlete} emoji={emoji} />
        </div>
    );
}

export function InnerAthleteLabel({
    athlete,
    emoji,
}: {
    athlete: Athlete;
    emoji?: string;
}) {
    return (
        <div className='flex items-center gap-2 text-lg uppercase'>
            {emoji && <span className='text-3xl'>{emoji}</span>}
            <strong>
                {athlete.first_name} {athlete.last_name}
            </strong>
            <CountryLabel code={athlete.country ?? ''} />
        </div>
    );
}

export default React.memo(AthleteLabel);
