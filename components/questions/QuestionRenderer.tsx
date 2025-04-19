import { Question } from '@/app/api/typer';
import AthleteQuestion from './AthleteQuestion';
import AthleteRankingQuestion from './AthleteRankingQuestion';
import CountryQuestion from './CountryQuestion';
import CountryRankingQuestion from './CountryRankingQuestion';

interface Props {
    question: Question;
    isPastDeadline: boolean;
    onSubmit: (answer: any) => void;
    onEdit?: () => void;
}

export default function QuestionRenderer({
    question,
    isPastDeadline,
    onSubmit,
    onEdit,
}: Props) {
    const sharedProps = {
        question,
        isPastDeadline,
        onSubmit,
        onEdit,
    };

    let content: JSX.Element | null = null;

    switch (question.type) {
        case 'athlete':
            content = <AthleteQuestion {...sharedProps} />;
            break;
        case 'athletes_three':
            content = <AthleteRankingQuestion {...sharedProps} />;
            break;
        case 'country':
            content = <CountryQuestion {...sharedProps} />;
            break;
        case 'countries_three':
            content = <CountryRankingQuestion {...sharedProps} />;
            break;
        default:
            return null;
    }

    return <StyledQuestion>{content}</StyledQuestion>;
}

interface StyledQuestionProps {
    children: React.ReactNode;
}

function StyledQuestion({ children }: StyledQuestionProps) {
    return <div className='flex w-full flex-col bg-white p-8'>{children}</div>;
}
