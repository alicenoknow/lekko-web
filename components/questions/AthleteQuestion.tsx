'use client';

import { txt } from '@/nls/texts';
import AthleteSearchBar from '@/components/forms/AthleteSearchBar';
import AthleteLabel from '../forms/AthleteLabel';
import CorrectAnswer from './common/CorrectAnswer';
import { AthleteAnswer, AthleteAnswerContent } from '@/types/answers';
import { AthleteQuestion as AthleteQuestionType } from '@/types/questions';
import { useAnswerSync } from '@/hooks/useAnswerSync';
import { useQuestionState } from '@/hooks/useQuestionState';

interface Props {
    question: AthleteQuestionType;
    answer: AthleteAnswer | undefined;
    isPastDeadline: boolean;
    onAnswerChanged: (content: AthleteAnswerContent) => void;
}

export default function AthleteQuestion({
    question,
    answer,
    isPastDeadline,
    onAnswerChanged,
}: Props) {
    const [selectedId, setSelectedId] = useAnswerSync(
        answer?.content?.athlete_id ?? null,
        (id) => onAnswerChanged({ athlete_id: id })
    );

    const { admin, isLocked, showCorrectAnswer } = useQuestionState(
        question,
        isPastDeadline
    );
    const hasAnswer = !!answer?.content?.athlete_id;

    return (
        <div className='flex flex-col gap-6'>
            {!admin &&
                (isLocked ? (
                    hasAnswer ? (
                        <AthleteLabel
                            label={txt.forms.yourAnswer}
                            selected={selectedId}
                        />
                    ) : (
                        <p className='text-grey text-sm'>
                            {txt.questions.resolved}
                        </p>
                    )
                ) : (
                    <AthleteSearchBar
                        label={txt.forms.yourAnswer}
                        selected={selectedId}
                        onSelect={setSelectedId}
                    />
                ))}
            {showCorrectAnswer && question.correct_answer?.athlete_id && (
                <CorrectAnswer
                    maxPoints={admin ? undefined : question.points}
                    grantedPoints={admin ? undefined : answer?.points}
                >
                    <AthleteLabel
                        selected={question.correct_answer.athlete_id}
                    />
                </CorrectAnswer>
            )}
            {admin && !question.correct_answer && (
                <p className='text-grey text-sm'>
                    {txt.questions.noCorrectAnswer}
                </p>
            )}
        </div>
    );
}
