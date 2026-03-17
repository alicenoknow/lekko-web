import { txt } from '@/nls/texts';

interface UserStatsProps {
    place?: number | null | undefined;
    points?: number | null | undefined;
}

export default function UserStats({ place, points }: UserStatsProps) {
    const hasData =
        place !== undefined &&
        place !== null &&
        points !== undefined &&
        points !== null;

    if (!hasData) return null;

    return (
        <div className='flex flex-row items-center gap-3'>
            <div className='bg-accent-dark flex flex-col items-end rounded-xl px-4 py-2 shadow-lg'>
                <span className='text-primary-light text-sm'>
                    {txt.events.yourPlace}
                </span>
                <span className='text-primary-light text-2xl font-bold'>
                    {place ?? '-'}
                </span>
            </div>
            <div className='bg-accent-dark flex flex-col items-end rounded-xl px-4 py-2 shadow-lg'>
                <span className='text-primary-light text-sm'>
                    {txt.events.yourPoints}
                </span>
                <span className='text-primary-light text-2xl font-bold'>
                    {points ?? '-'}
                </span>
            </div>
        </div>
    );
}
