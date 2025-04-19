'use client';

import { FaPlus } from 'react-icons/fa';
import { ActionButton } from '@/components/buttons';
import { txt } from '@/nls/texts';
import React from 'react';

export type QuestionType =
    | 'athlete'
    | 'athletes_three'
    | 'country'
    | 'countries_three';

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
            <select
                className='border-r-8 border-transparent p-2 text-sm text-primaryDark md:p-4 md:text-xl'
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
            <ActionButton
                label={
                    <span className='flex items-center gap-2'>
                        <FaPlus />
                        <span className='hidden text-lg md:inline'>
                            {txt.questions.add}
                        </span>
                    </span>
                }
                onClick={onAdd}
            />
        </div>
    );
}

export default React.memo(QuestionTypeSelector);
