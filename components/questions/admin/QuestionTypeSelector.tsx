'use client';

import { FaPlus } from 'react-icons/fa';
import ActionButton from '@/components/buttons/ActionButton';
import DropdownArrow from '@/components/forms/DropdownArrow';
import { txt } from '@/nls/texts';
import React from 'react';
import { QuestionType } from '@/types/questions';

interface Props {
    selected: QuestionType;
    setSelected: (type: QuestionType) => void;
    onAdd: () => void;
}

const questionOptions: { label: string; value: QuestionType }[] = [
    { label: txt.questions.types.athlete, value: 'athlete' },
    { label: txt.questions.types.athleteRank, value: 'athletes_three' },
    { label: txt.questions.types.country, value: 'country' },
    { label: txt.questions.types.countryRank, value: 'countries_three' },
];

function QuestionTypeSelector({ selected, setSelected, onAdd }: Props) {
    return (
        <div className='mx-auto flex max-w-sm flex-col gap-4 sm:flex-row sm:items-center sm:gap-6'>
            <div className='relative'>
                <select
                    aria-label='select question type'
                    className='border border-gray-300 appearance-none bg-white p-2 pr-12 text-sm text-primary-dark md:p-4 md:pr-16 md:text-xl focus:border-primary-dark w-full cursor-pointer'
                    value={selected}
                    onChange={(e) => {
                        setSelected(e.target.value as QuestionType);
                    }}
                >
                    {questionOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <DropdownArrow />
            </div>
            <ActionButton
                label={
                    <span className='flex items-center gap-2'>
                        <FaPlus />
                        <span className='text-lg'>{txt.questions.add}</span>
                    </span>
                }
                onClick={onAdd}
            />
        </div>
    );
}

export default React.memo(QuestionTypeSelector);
