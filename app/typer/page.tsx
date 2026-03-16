'use client';

import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
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
import ConfirmationDialog from '@/components/forms/ConfirmationDialog';
import { useMutationWithError } from '@/hooks/useMutationWithError';
import { useConfirmationDialog } from '@/hooks/useConfirmationDialog';

export default function EventsPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const { token } = useAuthenticatedUser();

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

    const {
        mutate: deleteEventMutation,
        isPending: isDeleting,
        variables: deletingEventId,
    } = useMutationWithError({
        mutationFn: (id: number) => deleteEvent(id, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
        errorMessage: txt.events.removeError,
    });

    const {
        mutate: toggleStatusMutation,
        isPending: isTogglingStatus,
        variables: togglingStatusId,
    } = useMutationWithError({
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
        errorMessage: txt.errors.eventStatusUpdate,
    });

    const deleteConfirm = useConfirmationDialog<number>(
        (id) => deleteEventMutation(id)
    );

    const toggleConfirm = useConfirmationDialog<{
        id: number;
        status: 'draft' | 'published';
    }>((item) => toggleStatusMutation(item));

    const handleToggleStatusRequest = (
        id: number,
        currentStatus: 'draft' | 'published'
    ) => {
        toggleConfirm.openDialog({
            id,
            status: currentStatus === 'draft' ? 'published' : 'draft',
        });
    };

    if (isLoading)
        return (
            <div className='flex flex-1 items-center justify-center'>
                <Spinner />
            </div>
        );

    if (isError) return <ErrorMessage errorMessage={txt.events.notFound} />;

    const hasEvents = !!events?.data?.length;

    return (
        <>
            <div className='mt-6 mb-4 flex items-center justify-between'>
                <span className='text-3xl font-bold'>{txt.events.title}</span>
                <AdminOnly>
                    <LazyAddEvent
                        onEventAdd={() => router.push('/typer/new')}
                    />
                </AdminOnly>
            </div>
            {hasEvents ? (
                events!.data.map((event) => (
                    <EventCard
                        key={event.id}
                        event={event}
                        onEdit={() =>
                            router.push(`/typer/event/${event.id}`)
                        }
                        onAdminEdit={() =>
                            router.push(`/typer/event/${event.id}/admin`)
                        }
                        onDelete={() => deleteConfirm.openDialog(event.id)}
                        onToggleStatus={() =>
                            handleToggleStatusRequest(event.id, event.status)
                        }
                        onGoToRanking={() =>
                            router.push(`/ranking?eventId=${event.id}`)
                        }
                        isDeleting={isDeleting && deletingEventId === event.id}
                        isTogglingStatus={
                            isTogglingStatus &&
                            togglingStatusId?.id === event.id
                        }
                    />
                ))
            ) : (
                <ErrorMessage errorMessage={txt.events.notFound} />
            )}
            {events && !events.pagination_info.is_last_page && (
                <Pagination pagination={events.pagination_info} changePage={setPage} />
            )}
            <ConfirmationDialog
                isOpen={deleteConfirm.isOpen}
                title={txt.events.delete}
                description={txt.events.deleteConfirm}
                onConfirm={deleteConfirm.handleConfirm}
                onCancel={deleteConfirm.handleCancel}
                confirmLabel={txt.forms.confirm}
                cancelLabel={txt.forms.cancel}
            />
            <ConfirmationDialog
                isOpen={toggleConfirm.isOpen}
                title={
                    toggleConfirm.item?.status === 'published'
                        ? txt.events.publish
                        : txt.events.unpublish
                }
                description={
                    toggleConfirm.item?.status === 'published'
                        ? txt.events.publishConfirm
                        : txt.events.unpublishConfirm
                }
                onConfirm={toggleConfirm.handleConfirm}
                onCancel={toggleConfirm.handleCancel}
                confirmLabel={txt.forms.confirm}
                cancelLabel={txt.forms.cancel}
            />
        </>
    );
}
