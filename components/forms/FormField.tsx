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
    placeholder,
}) => {
    return (
        <div className='mb-4 flex items-center'>
            {label && (
                <label
                    className='mr-12 text-sm font-bold uppercase text-primaryDark md:text-lg'
                    htmlFor={id}
                >
                    {label}:
                </label>
            )}
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
