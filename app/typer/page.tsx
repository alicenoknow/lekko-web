'use client';

import BaseButton from '@/components/buttons/BaseButton';
import { AuthContext } from '@/contexts/AuthContext';
import { TextContext } from '@/contexts/TextContext';
import { TyperEvent } from '@/types';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

export default function Typer() {
    const today = new Date();

    const { token } = useContext(AuthContext);
    const { fetchErrorText, goToEvent, overdueText, typerTitleText } =
        useContext(TextContext);

    const router = useRouter();

    const [isLoading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [events, setEvents] = useState<readonly TyperEvent[]>([
        {
            eventId: 'e1',
            name: 'Event One',
            finalDate: new Date('2024-03-01'),
        },
        {
            eventId: 'e2',
            name: 'Event Two',
            finalDate: new Date('2024-08-15'),
        },
        {
            eventId: 'e3',
            name: 'Event Three',
            finalDate: new Date('2024-12-25'),
        },
    ]);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/events`
                );
                setEvents(response.data.events);
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

        if (!token) {
            console.log('No token, redirected to login');
            router.push('/user/login');
        } else {
            fetchEvents();
        }
    }, [token, router, fetchErrorText]);

    const handleRedirect = (eventId: string) => {
        router.push(`/typer/event/${eventId}`);
    };

    const isOverdue = (event: TyperEvent) => today > event.finalDate;

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
            <div className='mb-16 text-2xl font-bold uppercase'>
                {typerTitleText}
            </div>
            <div>
                {events.map((event: TyperEvent, idx: number) => (
                    <div key={idx}>
                        <div className='mt-3 flex place-content-between'>
                            <span className='flex items-center justify-center font-semibold'>
                                {event.name}
                            </span>
                            {isOverdue(event) && (
                                <span className='flex items-center justify-center'>
                                    {overdueText}
                                </span>
                            )}
                            <BaseButton
                                onClick={() => handleRedirect(event.eventId)}
                                disabled={isOverdue(event)}
                                label={goToEvent}
                            />
                        </div>
                        {idx < events.length - 1 && (
                            <div
                                key={idx}
                                className='mt-3 h-px w-full bg-gray-400'
                            />
                        )}
                    </div>
                ))}
            </div>
        </main>
    );
}
