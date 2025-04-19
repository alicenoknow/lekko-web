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
    label,
    id,
    type = 'text',
    value,
    onChange,
    required = false,
    multiline = false,
    rows = 4,
    emoji,
    placeholder,
}) => {
    return (
        <div className='mb-4 flex items-center gap-4'>
            {label && (
                <label
                    className='mr-8 text-sm font-bold uppercase text-primaryDark md:text-lg'
                    htmlFor={id}
                >
                    {label}:
                </label>
            )}
            {emoji && <span className='text-3xl'>{emoji}</span>}
            {multiline ? (
                <textarea
                    className='w-full border p-2 text-sm text-primaryDark md:p-4 md:text-lg'
                    id={id}
                    value={value}
                    onChange={onChange}
                    required={required}
                    rows={rows}
                    placeholder={placeholder}
                />
            ) : (
                <input
                    className='w-full border p-2 text-sm text-primaryDark md:p-4 md:text-lg'
                    type={type}
                    id={id}
                    value={value}
                    onChange={onChange}
                    required={required}
                    placeholder={placeholder}
                    autoComplete='off'
                />
            )}
        </div>
    );
};

export default React.memo(FormField);
