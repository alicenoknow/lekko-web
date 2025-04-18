import { FaRegStar } from 'react-icons/fa';

interface Props {
    maxPoints: number;
    grantedPoints?: number;
}

export default function Points({ maxPoints, grantedPoints }: Props) {
    return (
        <div className='flex h-16 items-center justify-center bg-accentLight p-2'>
            <div className='flex flex-row items-center justify-center gap-1 text-center'>
                <div className='flex items-center text-xl font-bold text-primaryDark'>
                    {grantedPoints !== undefined && (
                        <span>{grantedPoints}/</span>
                    )}
                    <span>{maxPoints}</span>
                </div>
                <FaRegStar size={20} className='mb-1 text-primaryDark' />
            </div>
        </div>
    );
}
