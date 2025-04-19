import { FaRegStar } from 'react-icons/fa';

interface Props {
    maxPoints: number;
    grantedPoints?: number;
}

export default function Points({ maxPoints, grantedPoints }: Props) {
    return (
        <div
            className='flex h-12 items-center justify-center bg-accentLight px-3'
            aria-label='Points awarded'
        >
            <div className='flex flex-row items-center justify-center gap-2 text-center text-primaryDark'>
                <div className='text-xl font-bold'>
                    {grantedPoints !== undefined ? (
                        <>
                            <span>{grantedPoints}</span>
                            <span className='text-sm font-medium'>
                                {' '}
                                / {maxPoints}
                            </span>
                        </>
                    ) : (
                        <span>{maxPoints}</span>
                    )}
                </div>
                <FaRegStar size={20} className='flex-shrink-0' />
            </div>
        </div>
    );
}
