'use client';

import { useEffect, useState } from 'react';
import { Question } from '@/types/questions';
import { Answer } from '@/types/answers';
import AthleteSearchBar from '@/components/forms/AthleteSearchBar';
import CorrectAnswer from '../common/CorrectAnswer';

interface Props {
    question: Question;
    onAnswerChanged: (content: Answer['content']) => void;
}

export default function EditAthleteRankingQuestion({
    question,
    onAnswerChanged,
}: Props) {
    const [selectedAthleteId1, setSelectedAthleteId1] = useState<number | null>(
        question.correct_answer?.athlete_id_one || null
    );
    const [selectedAthleteId2, setSelectedAthleteId2] = useState<number | null>(
        question.correct_answer?.athlete_id_two || null
    );
    const [selectedAthleteId3, setSelectedAthleteId3] = useState<number | null>(
        question.correct_answer?.athlete_id_three || null
    );

    useEffect(() => {
        if (
            selectedAthleteId1 !== null &&
            selectedAthleteId2 !== null &&
            selectedAthleteId3 !== null
        ) {
            onAnswerChanged({
                athlete_id_one: selectedAthleteId1,
                athlete_id_two: selectedAthleteId2,
                athlete_id_three: selectedAthleteId3,
            });
        }
    }, [
        selectedAthleteId1,
        selectedAthleteId2,
        selectedAthleteId3,
        onAnswerChanged,
    ]);

    return (
        <CorrectAnswer>
            <AthleteSearchBar
                emoji='🥇'
                selected={selectedAthleteId1}
                onSelect={setSelectedAthleteId1}
            />
            <AthleteSearchBar
                emoji='🥈'
                selected={selectedAthleteId2}
                onSelect={setSelectedAthleteId2}
            />
            <AthleteSearchBar
                emoji='🥉'
                selected={selectedAthleteId3}
                onSelect={setSelectedAthleteId3}
            />
        </CorrectAnswer>
    );
}
