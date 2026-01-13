'use client';

import { useCallback, useState } from 'react';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { deleteEvent, fetchEvents } from '@/lib/api/events';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import Spinner from '@/components/Spinner';
import { txt } from '@/nls/texts';
import Pagination from '@/components/buttons/Pagination';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import { AdminOnly } from '@/components/auth/AdminOnly';
import { useRouter } from 'next/navigation';
import { queryClient } from '@/context/QueryProvider';
import EventCard from '@/components/event/EventCard';
import LazyAddEvent from '@/components/event/LazyAddEvent';
import { useErrorStore } from '@/store/error';
import LazyConfirmationDialog from '@/components/forms/LazyConfirmationDialog';

export default function EventsPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [isConfirmationOpen, setConfirmationOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<number | null>(null);
    const { token } = useAuthenticatedUser();
    const { showErrorDialog } = useErrorStore();

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
        onError: () => {
            console.error('Cannot remove event.');
            showErrorDialog(txt.events.removeError);
        },
    });

    const handleOpen = useCallback(
        (id: number) => router.push(`/typer/event/${id}`),
        [router]
    );

    const handleAdminOpen = useCallback(
        (id: number) => router.push(`/typer/event/${id}/admin`),
        [router]
    );

    const handleAdd = useCallback(() => router.push('/typer/new'), [router]);

    const handleDeleteRequest = useCallback((id: number) => {
        setEventToDelete(id);
        setConfirmationOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(() => {
        if (eventToDelete !== null) {
            deleteEventMutation(eventToDelete);
        }
        setConfirmationOpen(false);
        setEventToDelete(null);
    }, [eventToDelete, deleteEventMutation]);

    const handleCancelDelete = useCallback(() => {
        setConfirmationOpen(false);
        setEventToDelete(null);
    }, []);

    if (isLoading || isDeleting) return <Spinner />;
    if (isError || !events || !events.data || events.data.length === 0) {
        return <ErrorMessage errorMessage={txt.events.notFound} />;
    }

    return (
        <>
            <div className='mb-4 mt-6 flex items-center justify-between'>
                <span className='text-3xl font-bold'>{txt.events.title}</span>
                <AdminOnly>
                    <LazyAddEvent onEventAdd={handleAdd} />
                </AdminOnly>
            </div>
            {events.data.map((event) => (
                <EventCard
                    key={event.id}
                    event={event}
                    onEdit={() => handleOpen(event.id)}
                    onAdminEdit={() => handleAdminOpen(event.id)}
                    onDelete={() => handleDeleteRequest(event.id)}
                    isDeleting={isDeleting}
                />
            ))}
            {events?.pagination_info && (
                <Pagination
                    pagination={events.pagination_info}
                    changePage={setPage}
                />
            )}
            <LazyConfirmationDialog
                isOpen={isConfirmationOpen}
                title={txt.events.delete}
                description={txt.events.deleteConfirm}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmLabel={txt.forms.confirm}
                cancelLabel={txt.forms.cancel}
            />
        </>
    );
}
