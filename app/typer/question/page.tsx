'use client';

import { AuthContext } from '@/contexts/AuthContext';
import { TextContext } from '@/contexts/TextContext';
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import Spinner from '@/components/Spinner';
import { Answer, Athlete, Question } from '@/types';

export default function QuestionPage({
    question,
    answer,
}: {
    question: Question;
    answer: Answer;
}) {
    const { token } = useContext(AuthContext);

    const [athletes, setAthletes] = useState([]);
    const [selectedAthletes, setSelectedAthletes] = useState([]);
    const [valueAnswer, setValueAnswer] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { searchText, fetchErrorText } = useContext(TextContext);
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            console.log('No token, redirected to login');
            router.push('/user/login');
        } else if (question.disciplineId) {
            const fetchQuestions = async () => {
                setLoading(true);
                try {
                    const response = await axios.post(
                        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/athletes`,
                        {
                            disciplineId: question.disciplineId,
                        }
                    );
                    setAthletes(response.data.athletes);
                } catch (error: unknown) {
                    // TODO: handle error type
                    if (axios.isAxiosError(error)) {
                        console.error('Axios error:', error.response?.data);
                    } else {
                        console.error('Unknown error:', error);
                    }
                    setErrorMessage(fetchErrorText);
                } finally {
                    setLoading(false);
                }
            };
            fetchQuestions();
        }
    }, [fetchErrorText, question.disciplineId, router, token]);

    useEffect(() => {
        if (answer) {
            if (answer.answer.type === 'RANK') {
                setSelectedAthletes(answer.answer.answer);
            } else if (answer.answer.type === 'VALUE') {
                setValueAnswer(answer.answer.answer);
            }
        }
    }, [answer]);

    const handleConfirm = () => {
        if (question.questionType === 'RANK') {
            saveRankAnswer(selectedAthletes);
        } else if (question.questionType === 'VALUE') {
            saveValueAnswer(valueAnswer);
        }
    };

    const handleAddAthlete = () => {
        // Add a custom athlete
        addCustomAthlete(searchQuery).then((athleteId: string) => {
            setSelectedAthletes([...selectedAthletes, athleteId]);
            setSearchQuery('');
        });
    };

    const filteredAthletes = athletes.filter(({ name }: { name: string }) =>
        name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (errorMessage) {
        return <ErrorMessage errorMessage={errorMessage} />;
    }

    if (isLoading) {
        return (
            <main className='flex items-center justify-center p-24'>
                <Spinner />
            </main>
        );
    }

    return (
        <div>
            <h2>{question.question}</h2>
            {question.questionType === 'RANK' ? (
                <>
                    <input
                        type='text'
                        placeholder={searchText}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <ul>
                        {filteredAthletes.map(({ athleteId, name }) => (
                            <li key={athleteId}>
                                <input
                                    type='checkbox'
                                    id={`athlete-${athleteId}`}
                                    name={`athlete-${athleteId}`}
                                    value={athleteId}
                                    checked={selectedAthletes.includes(
                                        athleteId
                                    )}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedAthletes([
                                                ...selectedAthletes,
                                                athleteId,
                                            ]);
                                        } else {
                                            setSelectedAthletes(
                                                selectedAthletes.filter(
                                                    (id) => id !== athleteId
                                                )
                                            );
                                        }
                                    }}
                                />
                                <label htmlFor={`athlete-${athleteId}`}>
                                    {name}
                                </label>
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleAddAthlete}>
                        Add custom athlete
                    </button>
                </>
            ) : (
                <>
                    <input
                        type='text'
                        value={valueAnswer}
                        onChange={(e) => setValueAnswer(e.target.value)}
                    />
                    {!answer && <p>No answer provided yet.</p>}
                </>
            )}
            <button onClick={handleConfirm}>Confirm</button>
        </div>
    );
}

// Placeholder functions to be replaced with actual implementations
const fetchAthletesByDiscipline = (disciplineId: string): Promise<Athlete[]> =>
    new Promise((resolve) => resolve([]));

const saveRankAnswer = (ranking: readonly Athlete[]): void => {};

const saveValueAnswer = (value: string): void => {};

const addCustomAthlete = (name: string): Promise<string> =>
    new Promise((resolve) => resolve('custom-athlete-id'));
