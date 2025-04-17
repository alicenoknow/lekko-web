'use client';

import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { ActionButton } from '@/components/buttons';
import { txt } from '@/nls/texts';

export type QuestionType =
    | 'athlete'
    | 'athlete_ranking'
    | 'country'
    | 'country_ranking';

interface Props {
    onAdd: (type: QuestionType) => void;
}

const questionOptions: { label: string; value: QuestionType }[] = [
    { label: txt.questions.types.athlete, value: 'athlete' },
    { label: txt.questions.types.athleteRank, value: 'athlete_ranking' },
    { label: txt.questions.types.country, value: 'country' },
    { label: txt.questions.types.countryRank, value: 'country_ranking' },
];

export default function QuestionTypeSelector({ onAdd }: Props) {
    const [selected, setSelected] = useState<QuestionType>('athlete');

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <select
                className="p-2 text-sm text-primaryDark md:p-4 md:text-xl"
                value={selected}
                onChange={(e) => setSelected(e.target.value as QuestionType)}
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
                onClick={() => onAdd(selected)}
            />
        </div>
    );
}
