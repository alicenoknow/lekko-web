import AthleteQuestion from './AthleteQuestion';
import AthleteRankingQuestion from './AthleteRankingQuestion';
import CountryQuestion from './CountryQuestion';
import CountryRankingQuestion from './CountryRankingQuestion';
import { Question } from '@/app/api/typer';

interface Props {
    question: Question;
    onSubmit: (answer: any) => void;
}

export default function QuestionRenderer({ question, onSubmit }: Props) {
    switch (question.type) {
        case 'athlete':
            return <AthleteQuestion question={question} onSubmit={onSubmit} />;

        case 'athletes_three':
            return (
                <AthleteRankingQuestion
                    question={question}
                    onSubmit={onSubmit}
                />
            );

        case 'country':
            return (
                <CountryQuestion questionId={question.id} onSubmit={onSubmit} />
            );

        case 'countries_three':
            return (
                <CountryRankingQuestion
                    questionId={question.id}
                    onSubmit={onSubmit}
                />
            );

        default:
            return null;
    }
}
