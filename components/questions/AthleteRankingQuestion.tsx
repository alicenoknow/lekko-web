'use client';

import { useState } from 'react';
import { Question, Answer } from '@/app/api/typer';
import { txt } from '@/nls/texts';
import AthleteSearchBar from '@/components/forms/AthleteSearchBar';
import AthleteLabel from '../forms/AthleteLabel';
import Points from './Points';
import { ActionButton } from '../buttons';
import { AdminOnly } from '../auth/AdminOnly';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import { isAdmin } from '@/lib/Admin';

interface Props {
    question: Question;
    isPastDeadline: boolean;
    onSubmit: (answer: Answer) => void;
    onEdit?: () => void;
}

export default function AthleteRankingQuestion({
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
    const [selectedAthleteId1, setSelectedAthleteId1] = useState<number | null>(
        answer?.content?.athlete_id_one || null
    );
    const [selectedAthleteId2, setSelectedAthleteId2] = useState<number | null>(
        answer?.content?.athlete_id_two || null
    );
    const [selectedAthleteId3, setSelectedAthleteId3] = useState<number | null>(
        answer?.content?.athlete_id_three || null
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModified, setModified] = useState(false);

    const isFormInvalid =
        !selectedAthleteId1 || !selectedAthleteId2 || !selectedAthleteId3;

    const handleSubmit = () => {
        if (isFormInvalid) return;
        setIsSubmitting(true);
        onSubmit({
            user_id: user.sub,
            question_id: question.id,
            content: {
                athlete_id_one: selectedAthleteId1,
                athlete_id_two: selectedAthleteId2,
                athlete_id_three: selectedAthleteId3,
            },
        });
        setIsSubmitting(false);
        setModified(false);
    };

    const handleSelectAthlete1 = (athleteId: number | null) => {
        setSelectedAthleteId1(athleteId);
        setModified(true);
    };

    const handleSelectAthlete2 = (athleteId: number | null) => {
        setSelectedAthleteId2(athleteId);
        setModified(true);
    };

    const handleSelectAthlete3 = (athleteId: number | null) => {
        setSelectedAthleteId3(athleteId);
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
            {isPastDeadline ? (
                <>
                    <div className='flex flex-row justify-between'>
                        <span className='mr-4 text-4xl'>🥇</span>
                        <AthleteLabel selected={selectedAthleteId1} />
                    </div>
                    <div className='flex flex-row justify-between'>
                        <span className='mr-4 text-4xl'>🥈</span>
                        <AthleteLabel selected={selectedAthleteId2} />
                    </div>
                    <div className='flex flex-row justify-between'>
                        <span className='mr-4 text-4xl'>🥉</span>
                        <AthleteLabel selected={selectedAthleteId3} />
                    </div>
                </>
            ) : (
                <>
                    <div className='flex flex-row justify-between'>
                        <span className='mr-4 text-4xl'>🥇</span>
                        <AthleteSearchBar
                            selected={selectedAthleteId1}
                            onSelect={handleSelectAthlete1}
                        />
                    </div>
                    <div className='flex flex-row justify-between'>
                        <span className='mr-4 text-4xl'>🥈</span>
                        <AthleteSearchBar
                            selected={selectedAthleteId2}
                            onSelect={handleSelectAthlete2}
                        />
                    </div>
                    <div className='flex flex-row justify-between'>
                        <span className='mr-4 text-4xl'>🥉</span>
                        <AthleteSearchBar
                            selected={selectedAthleteId3}
                            onSelect={handleSelectAthlete3}
                        />
                    </div>
                </>
            )}
            {question.correct_answer && (isPastDeadline || isAdmin(user)) && (
                <div className='bg-lightGreen'>
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
