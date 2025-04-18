'use client';

import { useState } from 'react';
import { Question } from '@/app/api/typer';
import QuestionFooterButtons from './QuestionFooterButtons';
import FormField from '@/components/forms/FormField';
import { txt } from '@/nls/texts';
import AthleteSearchBar from '@/components/forms/AthleteSearchBar';
import CountryLabel from '@/components/forms/CountryLabel';
import DropdownPillFilter from '@/components/forms/DropdownPillFilter';
import { COUNTRIES } from '@/lib/Countries';
import DropdownField from '@/components/forms/DropdownField';

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
        question?.correct_answer?.countries_three?.country_one || null
    );
    const [selectedCountry2, setSelectedCountry2] = useState<string | null>(
        question?.correct_answer?.countries_three?.country_two || null
    );
    const [selectedCountry3, setSelectedCountry3] = useState<string | null>(
        question?.correct_answer?.countries_three?.country_three || null
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
            correct_answer: {
                countries_three: {
                    country_one: selectedCountry1,
                    country_two: selectedCountry2,
                    country_three: selectedCountry3,
                },
            },
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
            <FormField
                label={txt.questions.content}
                id='question-content'
                type='text'
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                multiline
            />
            <FormField
                label={txt.questions.points}
                id='question-points'
                type='number'
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                required
            />
            {question.id > 0 && (
                <>
                    <p className='my-4 text-sm font-bold uppercase text-primaryDark md:text-lg'>
                        {txt.forms.correctAnswer}:
                    </p>
                    <div className='flex flex-row justify-between'>
                        <span className='mr-4 text-4xl'>🥇</span>
                        <DropdownField
                            options={Object.keys(COUNTRIES).map((code) => ({
                                value: code,
                                label: <CountryLabel code={code} />,
                            }))}
                            selected={selectedCountry1}
                            onSelect={setSelectedCountry1}
                        />
                    </div>
                    <div className='flex flex-row justify-between'>
                        <span className='mr-4 text-4xl'>🥈</span>
                        <DropdownField
                            options={Object.keys(COUNTRIES).map((code) => ({
                                value: code,
                                label: <CountryLabel code={code} />,
                            }))}
                            selected={selectedCountry2}
                            onSelect={setSelectedCountry2}
                        />
                    </div>
                    <div className='flex flex-row justify-between'>
                        <span className='mr-4 text-4xl'>🥉</span>
                        <DropdownField
                            options={Object.keys(COUNTRIES).map((code) => ({
                                value: code,
                                label: <CountryLabel code={code} />,
                            }))}
                            selected={selectedCountry3}
                            onSelect={setSelectedCountry3}
                        />
                    </div>
                </>
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
