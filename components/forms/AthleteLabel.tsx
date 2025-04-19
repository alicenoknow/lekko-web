import { fetchAthleteById } from '@/app/api/typer';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import { useQuery } from '@tanstack/react-query';
import CountryLabel from './CountryLabel';

interface Props {
    selected: number | null;
    label?: string;
}

export default function AthleteLabel({ label, selected }: Props) {
    const { token } = usePrivateUserContext();

    if (!token || selected === null) return null;

    const { data: athlete } = useQuery({
        queryKey: ['athlete', selected],
        queryFn: () => fetchAthleteById(selected, token),
        enabled: true,
    });

    if (!athlete) return null;

    return (
        <div className='flex flex-col gap-2'>
            {label && (
                <p className='text-sm font-bold uppercase text-primaryDark md:text-lg'>
                    {label}:
                </p>
            )}
            <span className='flex flex-row items-center gap-2 uppercase'>
                <strong>
                    {athlete.first_name} {athlete.last_name}
                </strong>
                <CountryLabel code={athlete.country ?? ''} />
            </span>
        </div>
    );
}
