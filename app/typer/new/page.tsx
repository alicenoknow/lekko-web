'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { txt } from '@/nls/texts';
import FormField from '@/components/forms/FormField';
import ActionButton from '@/components/buttons/ActionButton';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import { createEvent } from '@/lib/api/events';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { AdminOnly } from '@/components/auth/AdminOnly';
import { queryClient } from '@/context/QueryProvider';
import { useMutationWithError } from '@/hooks/useMutationWithError';

function CreateEventPage() {
    const router = useRouter();
    const { token } = useAuthenticatedUser();

    const [form, setForm] = useState({ name: '', description: '', deadline: '' });
    const [submitted, setSubmitted] = useState(false);

    const isFormInvalid = !form.name || !form.deadline;

    const mutation = useMutationWithError({
        mutationFn: ({
            name,
            description,
            deadline,
        }: {
            name: string;
            description: string;
            deadline: string;
        }) => {
            return createEvent(
                name,
                new Date(deadline).toISOString(),
                description || null,
                token
            );
        },
        onSuccess: (data) => {
            router.replace(`/typer/event/${data.id}/admin`);
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
        errorMessage: txt.events.createError,
        errorLogMessage: 'Create event error',
    });

    const handleSubmit = () => {
        setSubmitted(true);
        if (!isFormInvalid) {
            mutation.mutate(form);
        }
    };

    return (
        <>
            <h1 className='my-6 text-2xl font-bold uppercase'>
                {txt.events.createHeader}
            </h1>
            <FormField
                label={txt.forms.name}
                id='event-name'
                type='text'
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
            />
            <FormField
                label={txt.forms.description}
                id='event-description'
                type='text'
                multiline
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <FormField
                label={txt.forms.deadline}
                id='event-deadline'
                type='datetime-local'
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                required
            />
            {submitted && isFormInvalid && (
                <ErrorMessage errorMessage={txt.forms.fillAllInfo} />
            )}
            <ActionButton
                label={txt.forms.send}
                onClick={handleSubmit}
                loading={mutation.isPending}
                disabled={submitted && isFormInvalid}
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
