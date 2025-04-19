'use client';

import { useState } from 'react';
import { Question, Answer } from '@/app/api/typer';
import { txt } from '@/nls/texts';
import Points from './Points';
import { ActionButton } from '../buttons';
import { COUNTRIES } from '@/lib/Countries';
import CountryLabel from '../forms/CountryLabel';
import DropdownField from '../forms/DropdownField';
import { FaEdit } from 'react-icons/fa';
import { AdminOnly } from '../auth/AdminOnly';
import ActionIcon from '../buttons/ActionIcon';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import { isAdmin } from '@/lib/Admin';
import CountryDropdown from '../forms/CountryDropdown';

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
        answer?.content?.country || null
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModified, setModified] = useState(false);

    const isFormInvalid = !selectedCountry;

    const handleSubmit = () => {
        if (isFormInvalid) return;
        setIsSubmitting(true);
        onSubmit({
            user_id: user.sub,
            question_id: question.id,
            content: {
                country: selectedCountry,
            },
        });
        setIsSubmitting(false);
        setModified(false);
    };

    const handleSelectCountry = (country: string | null) => {
        setSelectedCountry(country);
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
            <CountryDropdown
                selected={selectedCountry}
                onSelect={handleSelectCountry}
                disabled={isPastDeadline}
            />
            {question.correct_answer && (isPastDeadline || isAdmin(user)) && (
                <div className='bg-lightGreen'>
                    <p className='my-4 text-sm font-bold uppercase text-primaryDark md:text-lg'>
                        {txt.forms.correctAnswer}:
                    </p>
                    <CountryDropdown
                        selected={question.correct_answer.country}
                        onSelect={() => {}}
                        disabled
                    />
                </div>
            )}
            <div className='mt-8 flex flex-row justify-between'>
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
                        <ActionIcon
                            label={<FaEdit size={24} />}
                            onClick={onEdit}
                        />
                    )}
                </AdminOnly>
            </div>
        </div>
    );
}
