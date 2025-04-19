import Points from "./Points";

interface Props {
    content: string;
    maxPoints: number;
    points: number | undefined;
}

export default function QuestionHeader({ content, maxPoints, points }: Props) {
    return (
        <div className='flex flex-row justify-between'>
        <div className='my-4 text-sm font-bold uppercase text-primaryDark md:text-lg'>
            {content}
        </div>
        <Points
            maxPoints={maxPoints}
            grantedPoints={points}
        />
    </div>
    );
}