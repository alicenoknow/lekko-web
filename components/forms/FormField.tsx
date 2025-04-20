'use client';

import React from 'react';

interface FormFieldProps {
    id: string;
    value: string | number;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    label?: string;
    type?: string;
    required?: boolean;
    multiline?: boolean;
    rows?: number;
    emoji?: string;
    placeholder?: string;
}

const FormField: React.FC<FormFieldProps> = ({
    id,
    value,
    onChange,
    label,
    type = 'text',
    required = false,
    multiline = false,
    rows = 4,
    emoji,
    placeholder,
}) => {
    const InputComponent = multiline ? 'textarea' : 'input';

    return (
        <div className='mb-4 flex w-full items-start gap-4'>
            {emoji && <span className='text-2xl'>{emoji}</span>}
            <div className='flex w-full flex-row items-center gap-8'>
                {label && (
                    <label
                        htmlFor={id}
                        className='mb-1 text-sm font-bold uppercase text-primaryDark md:text-lg'
                    >
                        {label}
                        {required && (
                            <span className='ml-1 text-red-500'>*</span>
                        )}
                    </label>
                )}
                <InputComponent
                    id={id}
                    className='w-full border p-2 text-sm text-primaryDark md:p-4 md:text-lg'
                    value={value}
                    onChange={onChange}
                    required={required}
                    placeholder={placeholder}
                    rows={multiline ? rows : undefined}
                    type={!multiline ? type : undefined}
                    autoComplete='off'
                />
            </div>
        </div>
    );
};

export default React.memo(FormField);
