import AthleteQuestion from './AthleteQuestion';
import AthleteRankingQuestion from './AthleteRankingQuestion';
import CountryQuestion from './CountryQuestion';
import CountryRankingQuestion from './CountryRankingQuestion';
import { Question } from '@/app/api/typer';

interface Props {
    question: Question;
    onSubmit: (question: Question) => void;
    onDelete: (questionId: number) => void;
}

export default function QuestionRenderer({
    question,
    onSubmit,
    onDelete,
}: Props) {
    switch (question.type) {
        case 'athlete':
            return <AthleteQuestion question={question} onSubmit={onSubmit} onDelete={onDelete}/>
        case 'athletes_three':
            return <AthleteRankingQuestion question={question} onSubmit={onSubmit} onDelete={onDelete} />
        case 'country':
            return <CountryQuestion question={question} onSubmit={onSubmit} onDelete={onDelete} />
        case 'countries_three':
            return <CountryRankingQuestion question={question} onSubmit={onSubmit} onDelete={onDelete} />
        default:
            return null;
    }
}
