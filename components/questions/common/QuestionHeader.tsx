import Points from './Points';

interface Props {
    content: string;
    maxPoints: number;
    points: number | undefined;
}

export default function QuestionHeader({ content, maxPoints, points }: Props) {
    return (
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
            <div className='text-lg font-bold text-primary-dark md:text-xl'>
                {content}
            </div>
            <Points maxPoints={maxPoints} {...(points !== undefined ? { grantedPoints: points } : {})} />
        </div>
    );
}
