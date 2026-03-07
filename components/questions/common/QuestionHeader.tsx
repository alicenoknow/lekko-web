import Points from './Points';

interface Props {
    content: string;
    maxPoints: number;
    points: number | undefined;
    adminView?: boolean;
}

export default function QuestionHeader({ content, maxPoints, points, adminView }: Props) {
    return (
        <div className='flex flex-row items-center justify-between gap-4'>
            <div className='text-lg font-bold text-primary-dark md:text-xl'>
                {content}
            </div>
            <div className='shrink-0'>
                <Points
                    maxPoints={maxPoints}
                    {...(adminView ? { adminView: true } : {})}
                    {...(!adminView && points !== undefined ? { grantedPoints: points } : {})}
                />
            </div>
        </div>
    );
}
