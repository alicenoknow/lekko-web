'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchAthleteById } from '@/app/api/events';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import CountryLabel from './CountryLabel';

interface Props {
    selected: number | null;
    label?: string;
    emoji?: string;
}

export default function AthleteLabel({ label, selected, emoji }: Props) {
    const { token } = usePrivateUserContext();

    const { data: athlete } = useQuery({
        queryKey: ['athlete', selected],
        queryFn: () => fetchAthleteById(selected!, token),
        enabled: !!token && selected !== null,
    });

    if (!athlete) return null;

    return (
        <div className='my-2 flex flex-col gap-2'>
            {label && (
                <p className='text-sm font-bold uppercase text-primaryDark md:text-lg'>
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
