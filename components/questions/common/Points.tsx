import { FaStar } from 'react-icons/fa';

interface Props {
    maxPoints?: number;
    grantedPoints?: number;
    adminView?: boolean;
    noBackground?: boolean;
}

export default function Points({ maxPoints, grantedPoints, adminView, noBackground }: Props) {
    return (
        <div
            className={`inline-flex items-center gap-3 rounded-lg px-4 py-3 ${noBackground ? 'bg-transparent' : 'bg-accent-light'}`}
            aria-label='Points awarded'
        >
            <FaStar size={20} className='flex-shrink-0 text-blue-accent' />
            <div className='flex flex-col items-end gap-0'>
                <div className='text-xl font-bold text-primary-dark'>
                    {adminView ? (
                        <span>{maxPoints}</span>
                    ) : grantedPoints !== undefined ? (
                        <>
                            <span>{grantedPoints}</span>
                            {maxPoints !== undefined && (
                                <span className='ml-1 text-sm font-semibold text-grey'>
                                    / {maxPoints}
                                </span>
                            )}
                        </>
                    ) : (
                        <>
                            <span className='text-grey'>?</span>
                            {maxPoints !== undefined && (
                                <span className='ml-1 text-sm font-semibold text-grey'>
                                    / {maxPoints}
                                </span>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
