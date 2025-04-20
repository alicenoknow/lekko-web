'use client';

import { useState, useEffect } from 'react';
import AthleteSearchBar from '@/components/forms/AthleteSearchBar';
import CorrectAnswer from '../common/CorrectAnswer';
import { Question } from '@/types/questions';
import { Answer } from '@/types/answers';

interface Props {
  question: Question;
  onAnswerChanged: (content: Answer['content']) => void;
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
