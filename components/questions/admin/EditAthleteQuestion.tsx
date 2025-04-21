'use client';

import { useState, useEffect } from 'react';
import AthleteSearchBar from '@/components/forms/AthleteSearchBar';
import CorrectAnswer from '../common/CorrectAnswer';
import { AthleteQuestion } from '@/types/questions';
import { AthleteAnswerContent } from '@/types/answers';

interface Props {
    question: AthleteQuestion;
    onAnswerChanged: (content: AthleteAnswerContent) => void;
}

export default function EditAthleteQuestion({
    question,
    onAnswerChanged,
}: Props) {
    const [selectedAthleteId, setSelectedAthleteId] = useState<number | null>(
        question.correct_answer?.athlete_id ?? null
    );

    useEffect(() => {
        if (selectedAthleteId !== null) {
            onAnswerChanged({ athlete_id: selectedAthleteId });
        }
    }, [selectedAthleteId, onAnswerChanged]);

    return (
        <CorrectAnswer>
            <AthleteSearchBar
                selected={selectedAthleteId}
                onSelect={setSelectedAthleteId}
            />
        </CorrectAnswer>
    );
}
