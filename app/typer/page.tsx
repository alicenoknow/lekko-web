'use client';

import { useCallback, useState } from 'react';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { deleteEvent, fetchEvents } from '@/app/api/events';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import Spinner from '@/components/Spinner';
import { txt } from '@/nls/texts';
import Pagination from '@/components/buttons/Pagination';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import { AdminOnly } from '@/components/auth/AdminOnly';
import { useRouter } from 'next/navigation';
import { queryClient } from '@/context/QueryProvider';
import EventCard from '@/components/event/EventCard';
import AddEvent from '@/components/event/AddEvent';

export default function EventsPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
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
        staleTime: 10 * 60 * 1000,
    });

    const { mutate: deleteEventMutation, isPending: isDeleting } = useMutation({
        mutationFn: (id: number) => deleteEvent(id, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
        onError: () => console.error('Cannot remove event.'),
    });

    const handleOpen = useCallback(
        (id: number) => router.push(`/typer/event/${id}`),
        [router]
    );

    const handleAdd = useCallback(() => router.push('/typer/new'), [router]);

    if (isLoading || isDeleting) return <Spinner />;
    if (isError || !events || !events.data || events.data.length === 0) {
        return <ErrorMessage errorMessage={txt.events.notFound} />;
    }

    return (
        <>
            <div className='mb-4 mt-6 flex items-center justify-between'>
                <span className='text-3xl font-bold'>{txt.events.title}</span>
                <AdminOnly>
                    <AddEvent onEventAdd={handleAdd} />
                </AdminOnly>
            </div>
            {events.data.map((event) => (
                <EventCard
                    key={event.id}
                    event={event}
                    onEdit={() => handleOpen(event.id)}
                    onDelete={() => deleteEventMutation(event.id)}
                    isDeleting={isDeleting}
                />
            ))}
            {events?.pagination_info && (
                <Pagination
                    pagination={events.pagination_info}
                    changePage={setPage}
                />
            )}
        </>
    );
}
