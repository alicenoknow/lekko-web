'use client';

import { useState } from 'react';
import { Question, Answer } from '@/app/api/typer';
import { txt } from '@/nls/texts';
import AthleteLabel from '../forms/AthleteLabel';
import Points from './Points';
import { ActionButton } from '../buttons';
import { COUNTRIES } from '@/lib/Countries';
import CountryLabel from '../forms/CountryLabel';
import DropdownField from '../forms/DropdownField';
import { AdminOnly } from '../auth/AdminOnly';
import ActionIcon from '../buttons/ActionIcon';
import { FaEdit } from 'react-icons/fa';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import { isAdmin } from '@/lib/Admin';

interface Props {
    question: Question;
    isPastDeadline: boolean;
    onSubmit: (answer: Answer) => void;
    onEdit?: () => void;
}

export default function CountryRankingQuestion({
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
    const [selectedCountry1, setSelectedCountry1] = useState<string | null>(
        answer?.content?.country_one || null
    );
    const [selectedCountry2, setSelectedCountry2] = useState<string | null>(
        answer?.content?.country_two || null
    );
    const [selectedCountry3, setSelectedCountry3] = useState<string | null>(
        answer?.content?.country_three || null
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModified, setModified] = useState(false);

    const isFormInvalid =
        !selectedCountry1 || !selectedCountry2 || !selectedCountry3;

    const handleSubmit = () => {
        if (isFormInvalid) return;
        setIsSubmitting(true);
        onSubmit({
            user_id: user.sub,
            question_id: question.id,
            content: {
                country_one: selectedCountry1,
                country_two: selectedCountry2,
                country_three: selectedCountry3,
            },
        });
        setIsSubmitting(false);
        setModified(false);
    };

    const handleSelectCountry1 = (country: string | null) => {
        setSelectedCountry1(country);
        setModified(true);
    };

    const handleSelectCountry2 = (country: string | null) => {
        setSelectedCountry2(country);
        setModified(true);
    };

    const handleSelectCountry3 = (country: string | null) => {
        setSelectedCountry3(country);
        setModified(true);
    };

    return (
        <div className='flex w-full flex-col bg-white p-8'>
            <div className='flex flex-row justify-between'>
                <div className='my-4 text-sm font-bold uppercase text-primaryDark md:text-lg'>
                    {question.content}
                </div>
                <Points
                    maxPoints={question.points}
                    grantedPoints={answer.points}
                />
            </div>

            <p className='my-4 text-sm font-bold uppercase text-primaryDark md:text-lg'>
                {txt.forms.yourAnswer}:
            </p>
            <div className='flex flex-row justify-between'>
                <span className='mr-4 text-4xl'>🥇</span>
                <DropdownField
                    options={Object.keys(COUNTRIES).map((code) => ({
                        value: code,
                        label: <CountryLabel code={code} />,
                    }))}
                    selected={selectedCountry1}
                    onSelect={handleSelectCountry1}
                    disabled={isPastDeadline}
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
                    onSelect={handleSelectCountry2}
                    disabled={isPastDeadline}
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
                    onSelect={handleSelectCountry3}
                    disabled={isPastDeadline}
                />
            </div>
            {question.correct_answer && (isPastDeadline || isAdmin(user)) && (
                <div className='bg-lightGreen'>
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
                            selected={question.correct_answer?.country_one}
                            onSelect={() => {}}
                            disabled
                        />
                    </div>
                    <div className='flex flex-row justify-between'>
                        <span className='mr-4 text-4xl'>🥈</span>
                        <DropdownField
                            options={Object.keys(COUNTRIES).map((code) => ({
                                value: code,
                                label: <CountryLabel code={code} />,
                            }))}
                            selected={question.correct_answer?.country_two}
                            onSelect={() => {}}
                            disabled
                        />
                    </div>
                    <div className='flex flex-row justify-between'>
                        <span className='mr-4 text-4xl'>🥉</span>
                        <DropdownField
                            options={Object.keys(COUNTRIES).map((code) => ({
                                value: code,
                                label: <CountryLabel code={code} />,
                            }))}
                            selected={question.correct_answer?.country_three}
                            onSelect={() => {}}
                            disabled
                        />
                    </div>
                </div>
            )}
            <div className='flex flex-row justify-between'>
                <ActionButton
                    loading={isSubmitting}
                    label={
                        isModified && !isPastDeadline
                            ? txt.forms.save
                            : txt.forms.saved
                    }
                    onClick={handleSubmit}
                    disabled={!isModified || isPastDeadline}
                />
                <AdminOnly>
                    {onEdit && (
                        <ActionButton label={txt.forms.edit} onClick={onEdit} />
                    )}
                </AdminOnly>
            </div>
        </div>
    );
}
