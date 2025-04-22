'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { txt } from '@/nls/texts';
import FormField from '@/components/forms/FormField';
import ActionButton from '@/components/buttons/ActionButton';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import { createEvent } from '@/app/api/events';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import { AdminOnly } from '@/components/auth/AdminOnly';
import { queryClient } from '@/context/QueryProvider';
import { useErrorStore } from '@/store/error';

function CreateEventPage() {
    const router = useRouter();
    const { token } = usePrivateUserContext();
    const { showErrorDialog } = useErrorStore();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');

    const isFormInvalid = !name || !deadline;

    const mutation = useMutation({
        mutationFn: () => {
            const formattedDeadline = new Date(deadline).toISOString();
            return createEvent(
                name,
                formattedDeadline,
                description || null,
                token
            );
        },
        onSuccess: (data) => {
            router.replace(`/typer/event/${data.id}`);
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
        onError: (err) => {
            console.error('Create event error:', err.message);
            showErrorDialog(txt.events.createError);
        },
    });

    const handleSubmit = useCallback(() => {
        mutation.mutate();
    }, [mutation]);

    return (
        <>
            <h1 className='my-6 text-2xl font-bold uppercase'>
                {txt.events.createHeader}
            </h1>
            <FormField
                label={txt.forms.name}
                id='event-name'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <FormField
                label={txt.forms.description}
                id='event-description'
                type='text'
                multiline
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <FormField
                label={txt.forms.deadline}
                id='event-deadline'
                type='datetime-local'
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
            />
            {isFormInvalid && (
                <ErrorMessage errorMessage={txt.forms.fillAllInfo} />
            )}
            <ActionButton
                label={txt.forms.send}
                onClick={handleSubmit}
                loading={mutation.isPending}
                disabled={isFormInvalid}
            />
        </>
    );
}

export default function AdminCreateEventPage() {
    return (
        <AdminOnly>
            <CreateEventPage />
        </AdminOnly>
    );
}
