'use client';

import { useState } from 'react';
import { Question, Answer } from '@/app/api/typer';
import { txt } from '@/nls/texts';
import AthleteSearchBar from '@/components/forms/AthleteSearchBar';
import AthleteLabel from '../forms/AthleteLabel';
import Points from './Points';
import { ActionButton } from '../buttons';

interface Props {
    question: Question;
    onSubmit: (answer: Answer) => void;
}

export default function AthleteQuestion({ question, onSubmit }: Props) {
    const answer: Answer = {
        id: 1,
        question_id: 2,
        content: {},
    };
    const [selectedAthleteId1, setSelectedAthleteId1] = useState<number | null>(
        answer?.content?.athletes_three?.athlete_id_one || null
    );
    const [selectedAthleteId2, setSelectedAthleteId2] = useState<number | null>(
        answer?.content?.athletes_three?.athlete_id_two || null
    );
    const [selectedAthleteId3, setSelectedAthleteId3] = useState<number | null>(
        answer?.content?.athletes_three?.athlete_id_three || null
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isFormInvalid =
        !selectedAthleteId1 || !selectedAthleteId2 || !selectedAthleteId3;

    const handleSubmit = () => {
        if (isFormInvalid) return;
        setIsSubmitting(true);
        onSubmit({
            user_id: 0, // TODO
            question_id: question.id,
            content: {
                athletes_three: {
                    athlete_id_one: selectedAthleteId1,
                    athlete_id_two: selectedAthleteId2,
                    athlete_id_three: selectedAthleteId3,
                },
            },
        });
        setIsSubmitting(false);
    };

    // TODO block answering after deadline
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
            <>
                <p className='my-4 text-sm font-bold uppercase text-primaryDark md:text-lg'>
                    {txt.forms.yourAnswer}:
                </p>
                <div className='flex flex-row justify-between'>
                    <span className='mr-4 text-4xl'>🥇</span>
                    <AthleteSearchBar
                        selected={selectedAthleteId1}
                        onSelect={setSelectedAthleteId1}
                    />
                </div>
                <div className='flex flex-row justify-between'>
                    <span className='mr-4 text-4xl'>🥈</span>
                    <AthleteSearchBar
                        selected={selectedAthleteId2}
                        onSelect={setSelectedAthleteId2}
                    />
                </div>
                <div className='flex flex-row justify-between'>
                    <span className='mr-4 text-4xl'>🥉</span>
                    <AthleteSearchBar
                        selected={selectedAthleteId3}
                        onSelect={setSelectedAthleteId3}
                    />
                </div>
            </>
            {question.correct_answer ? (
                <>
                    <p className='my-4 text-sm font-bold uppercase text-primaryDark md:text-lg'>
                        {txt.forms.yourAnswer}:
                    </p>
                    <div className='flex flex-row justify-between'>
                        <span className='mr-4 text-4xl'>🥇</span>
                        <AthleteLabel
                            selected={
                                answer.content.athlete_three.athlete_id_one
                            }
                        />
                    </div>
                    <div className='flex flex-row justify-between'>
                        <span className='mr-4 text-4xl'>🥈</span>
                        <AthleteLabel
                            selected={
                                answer.content.athlete_three.athlete_id_two
                            }
                        />
                    </div>
                    <div className='flex flex-row justify-between'>
                        <span className='mr-4 text-4xl'>🥉</span>
                        <AthleteLabel
                            selected={
                                answer.content.athlete_three.athlete_id_three
                            }
                        />
                    </div>
                </>
            ) : (
                <ActionButton
                    loading={isSubmitting}
                    label={txt.forms.save}
                    onClick={handleSubmit}
                />
            )}
        </div>
    );
}
