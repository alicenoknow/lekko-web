import ActionIcon from '@/components/buttons/ActionIcon';
import AthleteQuestion from './AthleteQuestion';
import AthleteRankingQuestion from './AthleteRankingQuestion';
import CountryQuestion from './CountryQuestion';
import CountryRankingQuestion from './CountryRankingQuestion';
import { Question } from '@/app/api/typer';
import { useCallback } from 'react';
import { TiDelete } from 'react-icons/ti';

interface Props {
    question: Question;
    onSubmit: (answer: any) => void;
    onDelete: (questionId: number) => void;
}

function DeleteQuestion({
    questionId,
    onDelete,
}: {
    questionId: number;
    onDelete: (questionId: number) => void;
}) {
    const deleteQuestion = useCallback(
        () => onDelete(questionId),
        [questionId, onDelete]
    );
    return (
        <ActionIcon label={<TiDelete size={24} />} onClick={deleteQuestion} />
    );
}

export default function QuestionRenderer({
    question,
    onSubmit,
    onDelete,
}: Props) {
    switch (question.type) {
        case 'athlete':
            return (
                <div>
                    <AthleteQuestion question={question} onSubmit={onSubmit} />;{' '}
                    <DeleteQuestion
                        questionId={question.id}
                        onDelete={onDelete}
                    />
                </div>
            );

        case 'athletes_three':
            return (
                <div>
                    <AthleteRankingQuestion
                        question={question}
                        onSubmit={onSubmit}
                    />
                    <DeleteQuestion
                        questionId={question.id}
                        onDelete={onDelete}
                    />
                </div>
            );

        case 'country':
            return (
                <div>
                    <CountryQuestion question={question} onSubmit={onSubmit} />{' '}
                    <DeleteQuestion
                        questionId={question.id}
                        onDelete={onDelete}
                    />
                </div>
            );

        case 'countries_three':
            return (
                <div>
                    <CountryRankingQuestion
                        question={question}
                        onSubmit={onSubmit}
                    />{' '}
                    <DeleteQuestion
                        questionId={question.id}
                        onDelete={onDelete}
                    />
                </div>
            );

        default:
            return null;
    }
}
