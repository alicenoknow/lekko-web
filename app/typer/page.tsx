'use client';

import { useState } from 'react';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { deleteEvent, fetchEvents } from '@/app/api/typer';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import Spinner from '@/components/Spinner';
import { txt } from '@/nls/texts';
import Pagination from '@/components/typer/Pagination';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import { AdminOnly } from '@/components/auth/AdminOnly';
import ActionIcon from '@/components/buttons/ActionIcon';
import { FaEdit, FaPlus } from 'react-icons/fa';
import { TiDelete } from 'react-icons/ti';
import { ActionButton } from '@/components/buttons';
import { useRouter } from 'next/navigation';
import { queryClient } from '@/lib/QueryProvider';

export default function EventsPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const { token } = usePrivateUserContext();

    const {
        data: events,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['events', page],
        queryFn: () => fetchEvents(token, page),
        enabled: !!token,
        placeholderData: keepPreviousData,
    });

    const { mutate: deleteEventMutation, isPending: isDeleting } = useMutation({
        mutationFn: (id: number) => deleteEvent(id, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
        onError: () => console.error('Cannot remove event.'),
    });

    const handleOpen = (id: number) => {
        setIsRedirecting(true);
        router.push(`/typer/event/${id}`);
    };

    const handleDelete = (id: number) => {
        deleteEventMutation(id);
    };

    const handleAdd = () => {
        setIsRedirecting(true);
        router.push('/typer/new');
    };

    if (isLoading || isDeleting) return <Spinner />;
    if (isError || !events || !events.data || events.data.length === 0) {
        return <ErrorMessage errorMessage={txt.events.notFound} />;
    }

    return (
        <div className='space-y-4 p-6'>
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
                        loading={isRedirecting}
                        disabled={isRedirecting}
                        onClick={handleAdd}
                    />
                </AdminOnly>
            </div>

            <ul className='space-y-4'>
                {events.data.map((event) => (
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
                                {new Date(event.deadline).toLocaleString()}
                            </p>
                        </div>
                        <div className='mt-4 flex items-center gap-4 md:ml-6 md:mt-0'>
                            <ActionIcon
                                label={<FaEdit size={24} />}
                                onClick={() => handleOpen(event.id)}
                                loading={isRedirecting}
                                disabled={isRedirecting}
                            />
                            <AdminOnly>
                                <ActionIcon
                                    disabled={isDeleting}
                                    loading={isDeleting}
                                    label={<TiDelete size={24} />}
                                    onClick={() => handleDelete(event.id)}
                                />
                            </AdminOnly>
                        </div>
                    </li>
                ))}
            </ul>
            {events?.pagination_info && (
                <Pagination
                    pagination={events.pagination_info}
                    changePage={setPage}
                />
            )}
        </div>
    );
}
