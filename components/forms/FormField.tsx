'use client';

import React from 'react';

interface FormFieldProps {
    id: string;
    value: string | number;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    onFocus?: (
        e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    label?: string;
    type?: string;
    required?: boolean;
    multiline?: boolean;
    rows?: number;
    emoji?: string;
    placeholder?: string;
    inputRef?: React.Ref<HTMLInputElement | HTMLTextAreaElement>;
}

const FormField: React.FC<FormFieldProps> = ({
    id,
    value,
    onChange,
    onFocus,
    label,
    type = 'text',
    required = false,
    multiline = false,
    rows = 4,
    emoji,
    placeholder,
    inputRef,
}) => {
    return (
        <div className='mb-4 flex w-full items-center gap-4'>
            {emoji && <span className='text-3xl'>{emoji}</span>}
            <div className='flex w-full flex-col gap-2 md:flex-row md:items-center md:gap-8'>
                {label && (
                    <label
                        htmlFor={id}
                        className='text-sm font-bold uppercase text-primaryDark md:text-lg'
                    >
                        {label}
                        {required && (
                            <span className='ml-1 text-red-500'>*</span>
                        )}
                    </label>
                )}
                {multiline ? (
                    <textarea
                        id={id}
                        ref={inputRef as React.Ref<HTMLTextAreaElement>}
                        className='w-full border p-2 text-sm text-primaryDark md:p-4 md:text-lg'
                        value={value}
                        onChange={onChange}
                        onFocus={onFocus}
                        required={required}
                        placeholder={placeholder}
                        rows={rows}
                    />
                ) : (
                    <input
                        id={id}
                        ref={inputRef as React.Ref<HTMLInputElement>}
                        className='w-full border p-2 text-sm text-primaryDark md:p-4 md:text-lg'
                        value={value}
                        onChange={onChange}
                        onFocus={onFocus}
                        required={required}
                        placeholder={placeholder}
                        type={type}
                    />
                )}
            </div>
        </div>
    );
};

export default React.memo(FormField);
