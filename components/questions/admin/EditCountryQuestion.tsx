'use client';

import { useState } from 'react';
import { Question } from '@/app/api/typer';
import QuestionFooterButtons from './common/QuestionFooterButtons';
import EditQuestionHeader from './common/EditQuestionHeader';
import CountryDropdown from '@/components/forms/CountryDropdown';
import CorrectAnswer from '../common/CorrectAnswer';

interface Props {
    question: Question;
    onSubmit: (question: Question) => void;
    onDelete: (questionId: number) => void;
}

export default function EditCountryQuestion({
    question,
    onSubmit,
    onDelete,
}: Props) {
    const [content, setContent] = useState(question.content);
    const [points, setPoints] = useState(question.points);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(
        question?.correct_answer?.country || null
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isFormInvalid = !content.trim() || points < 1;

    const handleSubmit = () => {
        if (isFormInvalid) return;
        setIsSubmitting(true);
        onSubmit({
            ...question,
            content: content.trim(),
            points,
            ...(selectedCountry !== null && {
                correct_answer: { country: selectedCountry },
            }),
        });
        setIsSubmitting(false);
    };

    const handleDelete = () => {
        setIsSubmitting(true);
        onDelete(question.id);
        setIsSubmitting(false);
    };

    return (
        <div className='relative flex w-full flex-col pr-4 pt-4'>
            <EditQuestionHeader
                content={content}
                points={points} 
                onContentChange={setContent} 
                onPointsChange={setPoints}
            />
            {question.id > 0 &&
                <CorrectAnswer>
                    <CountryDropdown
                        selected={selectedCountry}
                        onSelect={setSelectedCountry}
                    />
                </CorrectAnswer>
            }
            <QuestionFooterButtons
                disableSubmit={isFormInvalid}
                isLoading={isSubmitting}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
            />
        </div>
    );
}
