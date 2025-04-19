import AthleteQuestion from './AthleteQuestion';
import AthleteRankingQuestion from './AthleteRankingQuestion';
import CountryQuestion from './CountryQuestion';
import CountryRankingQuestion from './CountryRankingQuestion';
import { Question } from '@/app/api/typer';

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
    switch (question.type) {
        case 'athlete':
            return (
                <AthleteQuestion
                    question={question}
                    onSubmit={onSubmit}
                    isPastDeadline={isPastDeadline}
                    onEdit={onEdit}
                />
            );
        case 'athletes_three':
            return (
                <AthleteRankingQuestion
                    question={question}
                    onSubmit={onSubmit}
                    isPastDeadline={isPastDeadline}
                    onEdit={onEdit}
                />
            );
        case 'country':
            return (
                <CountryQuestion
                    question={question}
                    onSubmit={onSubmit}
                    isPastDeadline={isPastDeadline}
                    onEdit={onEdit}
                />
            );
        case 'countries_three':
            return (
                <CountryRankingQuestion
                    question={question}
                    onSubmit={onSubmit}
                    isPastDeadline={isPastDeadline}
                    onEdit={onEdit}
                />
            );
        default:
            return null;
    }
}
