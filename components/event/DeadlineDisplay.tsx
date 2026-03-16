import { FaClock } from 'react-icons/fa';
import { txt } from '@/nls/texts';

interface DeadlineDisplayProps {
    deadline: Date;
    isPastDeadline: boolean;
    size?: number;
}

export function DeadlineDisplay({
    deadline,
    isPastDeadline,
    size = 16,
}: DeadlineDisplayProps) {
    const colorClass = isPastDeadline ? 'text-dark-red' : 'text-grey';
    return (
        <div className='flex items-center gap-3'>
            <FaClock size={size} className={colorClass} />
            <p className={`text-sm font-semibold uppercase ${colorClass}`}>
                {txt.events.deadline}:{' '}
                {deadline.toLocaleDateString('pl-PL')}{' '}
                {deadline.toLocaleTimeString('pl-PL', {
                    hour: '2-digit',
                    minute: '2-digit',
                })}
            </p>
        </div>
    );
}
