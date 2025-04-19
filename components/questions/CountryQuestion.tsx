'use client';

import { useCallback, useState } from 'react';
import { Question, Answer } from '@/app/api/typer';
import { txt } from '@/nls/texts';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import { isAdmin } from '@/lib/Admin';
import CountryDropdown from '../forms/CountryDropdown';
import CorrectAnswer from './common/CorrectAnswer';
import QuestionFooterButtons from './common/QuestionFooterButtons';
import QuestionHeader from './common/QuestionHeader';

interface Props {
    question: Question;
    isPastDeadline: boolean;
    onSubmit: (answer: Answer) => void;
    onEdit?: () => void;
}

export default function CountryQuestion({
    question,
    isPastDeadline,
    onSubmit,
    onEdit,
}: Props) {
    const { user } = usePrivateUserContext();
    const answer: Answer = {
        id: 1,
        question_id: 2,
        content: {},
    };
    const [selectedCountry, setSelectedCountry] = useState<string | null>(
        answer.content?.country || null
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModified, setIsModified] = useState(false);

    const isFormInvalid = !selectedCountry;
    const showCorrectAnswer =
        question.correct_answer && (isPastDeadline || isAdmin(user));

    const handleSelectCountry = useCallback((country: string | null) => {
        setSelectedCountry(country);
        setIsModified(true);
    }, []);

    const handleSubmit = useCallback(() => {
        if (isFormInvalid) return;
        setIsSubmitting(true);
        onSubmit({
            user_id: user.sub,
            question_id: question.id,
            content: { country: selectedCountry },
        });
        setIsSubmitting(false);
        setIsModified(false);
    }, [user.sub, question.id, selectedCountry, isFormInvalid, onSubmit]);

    return (
        <>
            <QuestionHeader
                content={question.content}
                maxPoints={question.points}
                points={answer.points}
            />
            <CountryDropdown
                label={txt.forms.yourAnswer}
                selected={selectedCountry}
                onSelect={handleSelectCountry}
                disabled={isPastDeadline}
            />
            {showCorrectAnswer && (
                <CorrectAnswer>
                    <CountryDropdown
                        selected={question.correct_answer.country}
                        onSelect={() => {}}
                        disabled
                    />
                </CorrectAnswer>
            )}
            <QuestionFooterButtons
                isSubmitting={isSubmitting}
                isModified={isModified}
                isPastDeadline={isPastDeadline}
                onSubmit={handleSubmit}
                onEdit={onEdit}
            />
        </>
    );
}
