'use client';

import { useState } from 'react';
import QuestionFooterButtons from './common/QuestionFooterButtons';
import EditQuestionHeader from './common/EditQuestionHeader';
import CountryDropdown from '@/components/forms/CountryDropdown';
import CorrectAnswer from '../common/CorrectAnswer';
import { Question } from '@/types/questions';

interface Props {
    question: Question;
    onSubmit: (question: Question) => void;
    onDelete: (questionId: number) => void;
}

export default function EditCountryRankingQuestion({
    question,
    onSubmit,
    onDelete,
}: Props) {
    const [content, setContent] = useState(question.content);
    const [points, setPoints] = useState(question.points);
    const [selectedCountry1, setSelectedCountry1] = useState<string | null>(
        question?.correct_answer?.country_one || null
    );
    const [selectedCountry2, setSelectedCountry2] = useState<string | null>(
        question?.correct_answer?.country_two || null
    );
    const [selectedCountry3, setSelectedCountry3] = useState<string | null>(
        question?.correct_answer?.country_three || null
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
            ...(selectedCountry1 !== null &&
                selectedCountry2 !== null &&
                selectedCountry3 !== null && {
                    correct_answer: {
                        country_one: selectedCountry1,
                        country_two: selectedCountry2,
                        country_three: selectedCountry3,
                    },
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
            {question.id > 0 && (
                <CorrectAnswer>
                    <CountryDropdown
                        emoji='🥇'
                        selected={selectedCountry1}
                        onSelect={setSelectedCountry1}
                    />
                    <CountryDropdown
                        emoji='🥈'
                        selected={selectedCountry2}
                        onSelect={setSelectedCountry2}
                    />
                    <CountryDropdown
                        emoji='🥉'
                        selected={selectedCountry3}
                        onSelect={setSelectedCountry3}
                    />
                </CorrectAnswer>
            )}
            <QuestionFooterButtons
                disableSubmit={isFormInvalid}
                isLoading={isSubmitting}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
            />
        </div>
    );
}
