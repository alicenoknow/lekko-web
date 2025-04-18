import { fetchAthleteById } from '@/app/api/typer';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import { useQuery } from '@tanstack/react-query';
import CountryLabel from './CountryLabel';

interface Props {
    selected: number | null;
}

export default function AthleteLabel({ selected }: Props) {
    const { token } = usePrivateUserContext();
    const { data: selectedAthleteData } = useQuery({
        queryKey: ['athlete', selected],
        queryFn: () => fetchAthleteById(selected!, token),
        enabled: !!token && !!selected,
    });

    if (selectedAthleteData) {
        return (
            <span className='flex flex-row items-center gap-2 uppercase'>
                <strong>
                    {selectedAthleteData.first_name}{' '}
                    {selectedAthleteData.last_name}
                </strong>
                <CountryLabel code={selectedAthleteData.country ?? ''} />
            </span>
        );
    }
    return null;
}
