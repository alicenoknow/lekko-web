import { FaStar } from 'react-icons/fa';

interface Props {
    maxPoints: number;
    grantedPoints?: number;
}

export default function Points({ maxPoints, grantedPoints }: Props) {
    return (
        <div
            className='inline-flex items-center gap-3 rounded-lg bg-accent-light px-4 py-3'
            aria-label='Points awarded'
        >
            <FaStar size={20} className='flex-shrink-0 text-blue-accent' />
            <div className='flex flex-col items-end gap-0'>
                <div className='text-xl font-bold text-primary-dark'>
                    {grantedPoints !== undefined ? (
                        <span>{grantedPoints}</span>
                    ) : (
                        <span className='text-grey'>?</span>
                    )}
                    <span className='ml-1 text-sm font-semibold text-grey'>
                        / {maxPoints}
                    </span>
                </div>
            </div>
        </div>
    );
}
