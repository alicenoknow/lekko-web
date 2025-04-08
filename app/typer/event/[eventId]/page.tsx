'use client';

import { ActionButton } from '@/components/buttons';
import { AuthContext } from '@/contexts/AuthContext';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useContext, useState, useEffect } from 'react';

const EventDetail = () => {
    const { eventId } = useParams();

    const { token } = useContext(AuthContext);

    const router = useRouter();

    const [isLoading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [questions, setQuestions] = useState([
        {
            questionId: 'q1',
            questionType: 'RANK',
            eventId: 'e1',
            question: 'Rank the athletes based on their performance',
            answer: {
                type: 'RANK',
                answer: [
                    { athleteId: 'a1', name: 'Athlete 1' },
                    { athleteId: 'a2', name: 'Athlete 2' },
                    { athleteId: 'a3', name: 'Athlete 3' },
                ],
            },
            maxPoints: 10,
            disciplineId: 'd1',
        },
        {
            questionId: 'q2',
            questionType: 'VALUE',
            eventId: 'e1',
            question:
                'Enter the time taken by the athlete to complete the race',
            answer: {
                type: 'VALUE',
                answer: '00:01:23.45',
            },
            maxPoints: 5,
            disciplineId: 'd2',
        },
    ]);
    const [answers, setAnswers] = useState<readonly Answer[]>([
        {
            answerId: 'a1',
            questionId: 'q1',
            userId: 'u1',
            points: 8,
            answer: {
                type: 'RANK',
                answer: [
                    { athleteId: 'a1', name: 'Athlete 1' },
                    { athleteId: 'a3', name: 'Athlete 3' },
                    { athleteId: 'a2', name: 'Athlete 2' },
                ],
            },
        },
        {
            answerId: 'a2',
            questionId: 'q2',
            userId: 'u1',
            points: 5,
            answer: {
                type: 'VALUE',
                answer: '00:01:23.45',
            },
        },
    ]);

    useEffect(() => {
        if (!token) {
            console.log('No token, redirected to login');
            router.push('/user/login');
        } else {
            const fetchQuestions = async () => {
                setLoading(true);
                try {
                    const questionsResponse = await axios.post(
                        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/questions`,
                        {
                            eventId,
                        }
                    );
                    const answersResponse = await axios.post(
                        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/answers`,
                        {
                            eventId, // TODO user data
                        }
                    );
                    setQuestions(questionsResponse.data.questions);
                    setAnswers(answersResponse.data.questions);
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
    }, [token, router, fetchErrorText, eventId]);

    const redirectToQuestion = (questionId: string) => {
        return null;
    };

    // if (errorMessage) {
    //     return <ErrorMessage errorMessage={errorMessage} />;
    // }

    // if (isLoading) {
    //     return (
    //         <main className='flex items-center justify-center  p-24'>
    //             <Spinner />
    //         </main>
    //     );
    // }

    return (
        <main className='items-center p-24'>
            <ul>
                {questions.map((question) => {
                    const answer = answers.find(
                        (a) => a.questionId === question.questionId
                    );
                    return (
                        <li key={question.questionId}>
                            <h2>{question.question}</h2>
                            {answer ? (
                                <>
                                    <p>Answer: {answer.answerJSON}</p>
                                    {answer.points !== null && (
                                        <p>{answer.points}</p>
                                    )}
                                </>
                            ) : (
                                <p>Answer: Missing</p>
                            )}

                            <ActionButton
                                label={answer ? editAnswer : addAnswer}
                                onClick={() =>
                                    redirectToQuestion(question.questionId)
                                }
                            />
                        </li>
                    );
                })}
            </ul>
        </main>
    );
};

export default EventDetail;
