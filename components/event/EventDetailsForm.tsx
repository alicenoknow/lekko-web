'use client';

import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { txt } from '@/nls/texts';
import FormField from '@/components/forms/FormField';
import ActionButton from '@/components/buttons/ActionButton';

export type EventFormFields = 'name' | 'description' | 'deadline';

interface Props {
    form: Record<EventFormFields, string>;
    isModified: boolean;
    isSaving: boolean;
    onFormChange: (field: EventFormFields, value: string) => void;
    onSave: () => void;
}

export default function EventDetailsForm({
    form,
    isModified,
    isSaving,
    onFormChange,
    onSave,
}: Props) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <>
            <button
                onClick={() => setIsOpen((v) => !v)}
                className='mt-6 flex w-full items-center justify-between text-left'
            >
                <h1 className='text-xl font-bold md:text-3xl'>
                    {txt.events.edit}
                </h1>
                <FaChevronDown
                    className={`text-primary-dark transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                    size={20}
                />
            </button>
            {isOpen && (
                <div className='flex flex-col gap-2'>
                    <FormField
                        label={txt.forms.name}
                        id='event-title'
                        type='text'
                        value={form.name}
                        onChange={(e) => onFormChange('name', e.target.value)}
                    />
                    <FormField
                        label={txt.forms.description}
                        id='event-description'
                        type='text'
                        multiline
                        value={form.description}
                        onChange={(e) =>
                            onFormChange('description', e.target.value)
                        }
                    />
                    <FormField
                        label={txt.forms.deadline}
                        id='event-deadline'
                        type='datetime-local'
                        value={form.deadline}
                        onChange={(e) =>
                            onFormChange('deadline', e.target.value)
                        }
                    />
                    <ActionButton
                        label={isModified ? txt.forms.save : txt.forms.saved}
                        onClick={onSave}
                        loading={isSaving}
                        disabled={!isModified}
                        className='w-auto'
                    />
                </div>
            )}
        </>
    );
}
