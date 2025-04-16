'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    EventsData,
    getEvents,
    TyperEvent,
    PaginationInfo,
    deleteEvent,
} from '@/app/api/typer';
import { AxiosResponse } from 'axios';
import { ActionButton } from '@/components/buttons';
import { PrivateContent } from '@/components/auth/PrivateContent';
import { AdminOnly } from '@/components/auth/AdminOnly';
import Spinner from '@/components/Spinner';
import { isSuccess } from '../api/common';
import { ApiErrorType, handleError } from '../api/errors';
import { FaPlus, FaEdit } from 'react-icons/fa';
import { TiDelete } from 'react-icons/ti';
import { txt } from '@/nls/texts';
import Pagination from '@/components/typer/Pagination';
import ActionIcon from '@/components/buttons/ActionIcon';
import { usePrivateUserContext } from '@/context/PrivateUserContext';

function EventsContent() {
    const { token } = usePrivateUserContext();
    const router = useRouter();

    const [events, setEvents] = useState<readonly TyperEvent[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchEvents = useCallback(async (page: number) => {
        try {
            const response = await getEvents(token, page);
            if (isSuccess<EventsData>(response)) {
                setEvents(response.data.data);
                setPagination(response.data.pagination_info);
            } else {
                const error = (response as AxiosResponse<ApiErrorType>).data;
                console.error(handleError(error));
            }
        } catch (err) {
            console.error('Failed to load events:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents(1);
    }, []);

    const isPastDeadline = (deadline: string) =>
        new Date(deadline) < new Date();

    const handleOpen = (id: number) => {
        router.push(`/typer/event/${id}`);
    };

    const handleDelete = (id: number) => {
        deleteEvent(id, token);
    };

    const handleAdd = () => {
        router.push('/typer/new');
    };

    return (
        <div className='p-6'>
            <div className='mb-4 flex items-center justify-between'>
                <span className='text-3xl font-bold'>{txt.events.title}</span>
                <AdminOnly>
                    <ActionButton
                        label={
                            <span className='flex items-center gap-2'>
                                <FaPlus />
                                <span className='hidden text-lg md:inline'>
                                    {txt.events.newEvent}
                                </span>
                            </span>
                        }
                        onClick={handleAdd}
                    />
                </AdminOnly>
            </div>
            {loading ? (
                <Spinner />
            ) : events.length === 0 ? (
                <p>{txt.events.notFound}</p>
            ) : (
                <>
                    <ul className='space-y-4'>
                        {events.map((event) => (
                            <li
                                key={event.id}
                                className='flex flex-col rounded-md border bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between'
                            >
                                <div className='flex flex-col text-left'>
                                    <h2 className='font-semibold md:text-xl'>
                                        {event.name}
                                    </h2>
                                    {event.description && (
                                        <p className='mt-1 text-gray-600'>
                                            {event.description}
                                        </p>
                                    )}
                                    <p className='mt-2 text-sm'>
                                        {txt.events.deadline}:{' '}
                                        {new Date(
                                            event.deadline
                                        ).toLocaleString()}
                                    </p>
                                </div>
                                <div className='mt-4 flex items-center gap-4 md:ml-6 md:mt-0'>
                                    <ActionIcon
                                        label={<FaEdit size={24} />}
                                        onClick={() => handleOpen(event.id)}
                                        disabled={isPastDeadline(
                                            event.deadline
                                        )}
                                    />
                                    {
                                        <AdminOnly>
                                            <ActionIcon
                                                label={<TiDelete size={24} />}
                                                onClick={() =>
                                                    handleDelete(event.id)
                                                }
                                            />
                                        </AdminOnly>
                                    }
                                </div>
                            </li>
                        ))}
                    </ul>
                    {pagination && (
                        <Pagination
                            fetchEvents={fetchEvents}
                            pagination={pagination}
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default function EventsPage() {
    return (
        <PrivateContent redirect fallback={<Spinner />}>
            <EventsContent />
        </PrivateContent>
    );
}
