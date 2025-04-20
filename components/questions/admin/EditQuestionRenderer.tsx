import { Question } from '@/types/questions';
import EditAthleteQuestion from './EditAthleteQuestion';
import EditAthleteRankingQuestion from './EditAthleteRankingQuestion';
import EditCountryQuestion from './EditCountryQuestion';
import EditCountryRankingQuestion from './EditCountryRankingQuestion';
import { useCallback, useMemo, useState } from 'react';
import { Answer } from '@/types/answers';
import EditQuestionHeader from './common/EditQuestionHeader';
import QuestionFooterButtons from './common/QuestionFooterButtons';

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
    const [content, setContent] = useState(question.content);
    const [points, setPoints] = useState(question.points);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [correctAnswerPayload, setCorrectAnswerPayload] =
        useState<Answer['content']>();

    const isFormInvalid = useMemo(
        () => !content.trim() || points < 1,
        [content, points]
    );

    const handleSubmit = useCallback(() => {
        if (isFormInvalid) return;
        setIsSubmitting(true);
        onSubmit({
            ...question,
            content: content.trim(),
            points,
            ...(correctAnswerPayload && {
                correct_answer: correctAnswerPayload,
            }),
        });
        setIsSubmitting(false);
    }, [
        isFormInvalid,
        content,
        points,
        correctAnswerPayload,
        question,
        onSubmit,
    ]);

    const handleDelete = useCallback(() => {
        setIsSubmitting(true);
        onDelete(question.id);
        setIsSubmitting(false);
    }, [onDelete, question.id]);

    const renderQuestionComponent = () => {
        const sharedProps = {
            question,
            onAnswerChanged: setCorrectAnswerPayload,
        };

        switch (question.type) {
            case 'athlete':
                return <EditAthleteQuestion {...sharedProps} />;
            case 'athletes_three':
                return <EditAthleteRankingQuestion {...sharedProps} />;
            case 'country':
                return <EditCountryQuestion {...sharedProps} />;
            case 'countries_three':
                return <EditCountryRankingQuestion {...sharedProps} />;
            default:
                return null;
        }
    };

    return (
        <div className='relative flex w-full flex-col pr-4 pt-4'>
            <EditQuestionHeader
                content={content}
                points={points}
                onContentChange={setContent}
                onPointsChange={setPoints}
            />
            {renderQuestionComponent()}
            <QuestionFooterButtons
                disableSubmit={isFormInvalid}
                isLoading={isSubmitting}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
            />
        </div>
    );
}
