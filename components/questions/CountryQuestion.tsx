'use client';

import { txt } from '@/nls/texts';
import CountryDropdown from '../forms/CountryDropdown';
import CorrectAnswer from './common/CorrectAnswer';
import CountryLabel from '../forms/CountryLabel';
import { CountryAnswer, CountryAnswerContent } from '@/types/answers';
import { CountryQuestion as CountryQuestionType } from '@/types/questions';
import { useAnswerSync } from '@/hooks/useAnswerSync';
import { useQuestionState } from '@/hooks/useQuestionState';

interface Props {
    question: CountryQuestionType;
    answer: CountryAnswer | undefined;
    isPastDeadline: boolean;
    onAnswerChanged: (content: CountryAnswerContent) => void;
}

export default function CountryQuestion({
    question,
    answer,
    isPastDeadline,
    onAnswerChanged,
}: Props) {
    const [selectedCountry, setSelectedCountry] = useAnswerSync(
        answer?.content?.country ?? null,
        (country) => onAnswerChanged({ country })
    );

    const { admin, isLocked, showCorrectAnswer } = useQuestionState(
        question,
        isPastDeadline
    );
    const hasAnswer = !!answer?.content?.country;

    return (
        <div className='flex flex-col gap-6'>
            {!admin &&
                (isLocked ? (
                    hasAnswer ? (
                        <CountryLabel
                            code={selectedCountry ?? ''}
                            label={txt.forms.yourAnswer}
                            isLarge
                        />
                    ) : (
                        <p className='text-grey text-sm'>
                            {txt.questions.resolved}
                        </p>
                    )
                ) : (
                    <CountryDropdown
                        label={txt.forms.yourAnswer}
                        selected={selectedCountry}
                        onSelect={setSelectedCountry}
                    />
                ))}
            {showCorrectAnswer && question.correct_answer?.country && (
                <CorrectAnswer
                    maxPoints={admin ? undefined : question.points}
                    grantedPoints={admin ? undefined : answer?.points}
                >
                    <CountryLabel
                        code={question.correct_answer.country}
                        isLarge
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
