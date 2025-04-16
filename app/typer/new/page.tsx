'use client';

import { useState, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { txt } from '@/nls/texts';
import FormField from '@/components/forms/FormField';
import { ActionButton } from '@/components/buttons';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import { AxiosResponse } from 'axios';
import { isSuccess } from '@/app/api/common';
import { createEvent, CreateEventData } from '@/app/api/typer';
import { ApiErrorType, handleError } from '@/app/api/errors';
import { usePrivateUserContext } from '@/context/PrivateUserContext';

export default function CreateEventPage() {
  const router = useRouter();
  const { token } = usePrivateUserContext();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [isSubmitting, startSubmitTransition] = useTransition();

  const checkIfFormInvalid = useCallback(() => {
    return !name || !deadline;
  }, [name, deadline]);

  const maybeRenderError = () => {
    if (checkIfFormInvalid()) {
      return <ErrorMessage errorMessage={txt.forms.fillAllInfo} />;
    }
    if (errorMessage) {
      return <ErrorMessage errorMessage={errorMessage} />;
    }
    return null;
  };

  const handleSubmit = useCallback(() => {
    setErrorMessage('');

    startSubmitTransition(async () => {
      if (!token) return;
      try {
        const response = await createEvent(name, deadline, description || null, token);
        if (isSuccess<CreateEventData>(response)) {
          router.replace('/events');
        } else {
            const error = (response as AxiosResponse<ApiErrorType>).data;
            setErrorMessage(handleError(error));
        }
      } catch (err: any) {
        console.error(err);
        setErrorMessage(err?.response?.data?.message || 'Something went wrong');
      }
    });
  }, [name, description, deadline, router]);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold uppercase mb-6">{txt.events.createHeader}</h1>
      <FormField
        label={txt.forms.name}
        id="event-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <FormField
        label={txt.forms.description}
        id="event-description"
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <FormField
        label={txt.forms.deadline}
        id="event-deadline"
        type="datetime-local"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        required
      />
      {maybeRenderError()}
      <ActionButton
        label={txt.forms.send}
        onClick={handleSubmit}
        loading={isSubmitting}
        disabled={checkIfFormInvalid()}
      />
    </div>
  );
}

// TODO handle all like events page