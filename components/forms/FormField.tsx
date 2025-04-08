import React from 'react';

interface FormFieldProps {
    label: string;
    id: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
    label,
    id,
    type = 'text',
    value,
    onChange,
    required = false,
}) => {
    return (
        <div className='mb-4 flex items-center justify-between'>
            <label
                className='mr-4 text-sm font-bold uppercase text-primaryDark md:mr-12 md:text-xl'
                htmlFor={id}
            >
                {label}:
            </label>
            <input
                className='p-2 text-sm text-primaryDark md:p-4 md:text-xl'
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    );
};

export default React.memo(FormField);
