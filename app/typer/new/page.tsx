'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { txt } from '@/nls/texts';
import FormField from '@/components/forms/FormField';
import { ActionButton } from '@/components/buttons';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import { createEvent } from '@/app/api/typer';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import { AdminOnly } from '@/components/auth/AdminOnly';

function CreateEventPage() {
    const router = useRouter();
    const { token } = usePrivateUserContext();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const isFormInvalid = !name || !deadline;

    const mutation = useMutation({
        mutationFn: () =>
            createEvent(name, deadline, description || null, token!),
        onSuccess: (data) => {
            router.replace(`/event/${data.id}`);
        },
        onError: (err) => {
            console.warn('Create event error:', err.message);
            setErrorMessage(txt.events.createError);
        },
    });

    const handleSubmit = useCallback(() => {
        setErrorMessage('');
        mutation.mutate();
    }, [name, description, deadline, token]);

    return (
        <div className='mx-auto max-w-xl p-6'>
            <h1 className='mb-6 text-2xl font-bold uppercase'>
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
            {!isFormInvalid && errorMessage && (
                <ErrorMessage errorMessage={errorMessage} />
            )}

            <ActionButton
                label={txt.forms.send}
                onClick={handleSubmit}
                loading={mutation.isPending}
                disabled={isFormInvalid}
            />
        </div>
    );
}

export default function AdminCreateEventPage() {
    return (
        <AdminOnly>
            <CreateEventPage />
        </AdminOnly>
    );
}
