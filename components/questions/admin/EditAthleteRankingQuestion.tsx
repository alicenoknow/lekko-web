'use client';

import { useState } from 'react';
import { Question } from '@/app/api/typer';
import QuestionFooterButtons from './common/QuestionFooterButtons';
import AthleteSearchBar from '@/components/forms/AthleteSearchBar';
import EditQuestionHeader from './common/EditQuestionHeader';
import CorrectAnswer from '../common/CorrectAnswer';

interface Props {
    question: Question;
    onSubmit: (question: Question) => void;
    onDelete: (questionId: number) => void;
}

export default function EditAthleteRankingQuestion({
    question,
    onSubmit,
    onDelete,
}: Props) {
    const [content, setContent] = useState(question.content);
    const [points, setPoints] = useState(question.points);
    const [selectedAthleteId1, setSelectedAthleteId1] = useState<number | null>(
        question.correct_answer?.athlete_id_one || null
    );
    const [selectedAthleteId2, setSelectedAthleteId2] = useState<number | null>(
        question.correct_answer?.athlete_id_two || null
    );
    const [selectedAthleteId3, setSelectedAthleteId3] = useState<number | null>(
        question.correct_answer?.athlete_id_three || null
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
            ...(selectedAthleteId1 !== null &&
                selectedAthleteId2 !== null &&
                selectedAthleteId3 !== null && {
                    correct_answer: {
                        athlete_id_one: selectedAthleteId1,
                        athlete_id_two: selectedAthleteId2,
                        athlete_id_three: selectedAthleteId3,
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
