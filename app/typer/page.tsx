'use client';

import { useCallback, useState } from 'react';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { deleteEvent, fetchEvents, setEventStatus } from '@/lib/api/events';
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
import { EventsData } from '@/types/events';
import { logger } from '@/lib/logger';

export default function EventsPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [isConfirmationOpen, setConfirmationOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<number | null>(null);
    const [isStatusConfirmOpen, setStatusConfirmOpen] = useState(false);
    const [eventToToggle, setEventToToggle] = useState<{
        id: number;
        status: 'draft' | 'published';
    } | null>(null);
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
            logger.error('Cannot remove event.');
            showErrorDialog(txt.events.removeError);
        },
    });

    const {
        mutate: toggleStatusMutation,
        isPending: isTogglingStatus,
        variables: togglingStatusId,
    } = useMutation({
        mutationFn: ({
            id,
            status,
        }: {
            id: number;
            status: 'draft' | 'published';
        }) => setEventStatus(id, status, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
        onError: () => {
            logger.error('Cannot update event status.');
            showErrorDialog(txt.errors.eventStatusUpdate);
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

    const handleGoToRanking = useCallback(
        (id: number) => router.push(`/ranking?eventId=${id}`),
        [router]
    );

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

    const handleToggleStatusRequest = useCallback(
        (id: number, currentStatus: 'draft' | 'published') => {
            setEventToToggle({
                id,
                status: currentStatus === 'draft' ? 'published' : 'draft',
            });
            setStatusConfirmOpen(true);
        },
        []
    );

    const handleConfirmToggleStatus = useCallback(() => {
        if (eventToToggle) {
            toggleStatusMutation(eventToToggle);
        }
        setStatusConfirmOpen(false);
        setEventToToggle(null);
    }, [eventToToggle, toggleStatusMutation]);

    const handleCancelToggleStatus = useCallback(() => {
        setStatusConfirmOpen(false);
        setEventToToggle(null);
    }, []);

    const shouldShowEvents = useCallback(
        (events: EventsData | undefined): events is EventsData => {
            return (
                !isError && !!events && events.data && events.data.length !== 0
            );
        },
        [isError]
    );

    if (isLoading)
        return (
            <div className='flex flex-1 items-center justify-center'>
                <Spinner />
            </div>
        );

    return (
        <>
            <div className='mt-6 mb-4 flex items-center justify-between'>
                <span className='text-3xl font-bold'>{txt.events.title}</span>
                <AdminOnly>
                    <LazyAddEvent onEventAdd={handleAdd} />
                </AdminOnly>
            </div>
            {shouldShowEvents(events) ? (
                events.data.map((event) => (
                    <EventCard
                        key={event.id}
                        event={event}
                        onEdit={() => handleOpen(event.id)}
                        onAdminEdit={() => handleAdminOpen(event.id)}
                        onDelete={() => handleDeleteRequest(event.id)}
                        onToggleStatus={() =>
                            handleToggleStatusRequest(event.id, event.status)
                        }
                        onGoToRanking={() => handleGoToRanking(event.id)}
                        isDeleting={isDeleting}
                        isTogglingStatus={
                            isTogglingStatus &&
                            togglingStatusId?.id === event.id
                        }
                    />
                ))
            ) : (
                <ErrorMessage errorMessage={txt.events.notFound} />
            )}
            {events && events.total_count > events.limit && (
                <Pagination pagination={events} changePage={setPage} />
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
            <LazyConfirmationDialog
                isOpen={isStatusConfirmOpen}
                title={
                    eventToToggle?.status === 'published'
                        ? txt.events.publish
                        : txt.events.unpublish
                }
                description={
                    eventToToggle?.status === 'published'
                        ? txt.events.publishConfirm
                        : txt.events.unpublishConfirm
                }
                onConfirm={handleConfirmToggleStatus}
                onCancel={handleCancelToggleStatus}
                confirmLabel={txt.forms.confirm}
                cancelLabel={txt.forms.cancel}
            />
        </>
    );
}
