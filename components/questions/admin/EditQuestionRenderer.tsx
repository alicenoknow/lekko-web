import { Question } from '@/types/questions';
import EditAthleteQuestion from './EditAthleteQuestion';
import EditAthleteRankingQuestion from './EditAthleteRankingQuestion';
import EditCountryQuestion from './EditCountryQuestion';
import EditCountryRankingQuestion from './EditCountryRankingQuestion';

interface Props {
    question: Question;
    onSubmit: (question: Question) => void;
    onDelete: (questionId: number) => void;
}

export default function EditQuestionRenderer({
    question,
    onSubmit,
    onDelete,
}: Props) {
    switch (question.type) {
        case 'athlete':
            return (
                <EditAthleteQuestion
                    question={question}
                    onSubmit={onSubmit}
                    onDelete={onDelete}
                />
            );
        case 'athletes_three':
            return (
                <EditAthleteRankingQuestion
                    question={question}
                    onSubmit={onSubmit}
                    onDelete={onDelete}
                />
            );
        case 'country':
            return (
                <EditCountryQuestion
                    question={question}
                    onSubmit={onSubmit}
                    onDelete={onDelete}
                />
            );
        case 'countries_three':
            return (
                <EditCountryRankingQuestion
                    question={question}
                    onSubmit={onSubmit}
                    onDelete={onDelete}
                />
            );
        default:
            return null;
    }
}
