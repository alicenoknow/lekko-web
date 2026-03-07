'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import { registerUser } from '@/lib/api/auth';
import { txt } from '@/nls/texts';
import FormField from '@/components/forms/FormField';
import ActionButton from '@/components/buttons/ActionButton';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import { logger } from '@/lib/logger';

function RegisterForm() {
    const router = useRouter();

    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        passwordRepeat: '',
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [registered, setRegistered] = useState(false);

    const handleChange =
        (field: keyof typeof form) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setForm((prev) => ({ ...prev, [field]: e.target.value }));
            setErrorMessage('');
            setRegistered(false);
        };

    const isFormInvalid = useMemo(() => {
        const { username, email, password, passwordRepeat } = form;
        return (
            !username ||
            !email ||
            !password ||
            !passwordRepeat ||
            password.length < 6 ||
            password !== passwordRepeat
        );
    }, [form]);

    const { mutate: register, isPending: isSubmitting } = useMutation({
        mutationFn: () =>
            registerUser(form.email, form.username, form.password),
        onSuccess: () => setRegistered(true),
        onError: (err) => {
            logger.error('Register error:', err);
            setErrorMessage(txt.register.error);
        },
    });

    const handleSubmit = useCallback(() => {
        if (!isFormInvalid) {
            register();
        }
    }, [register, isFormInvalid]);

    const redirectToLogin = useCallback(() => {
        router.replace('/user/login');
    }, [router]);

    const getErrorMessage = () => {
        if (form.password && form.passwordRepeat && form.password !== form.passwordRepeat)
            return txt.register.passwordMismatch;
        if (isFormInvalid) return txt.forms.fillAllInfo;
        return errorMessage;
    };

    return (
        <div className='bg-primary-light flex flex-1 items-center justify-center px-4 py-8 md:px-6 md:py-12'>
            <div className='w-full max-w-4xl'>
                <div className='flex w-full flex-col space-y-6'>
                    <h1 className='text-2xl font-bold uppercase tracking-tight text-primary-dark'>
                        {txt.register.header}
                    </h1>
                    <FormField
                        label={txt.forms.username}
                        id='username'
                        type='text'
                        value={form.username}
                        onChange={handleChange('username')}
                        required
                    />
                    <FormField
                        label={txt.forms.email}
                        id='email'
                        type='email'
                        value={form.email}
                        onChange={handleChange('email')}
                        required
                    />
                    <FormField
                        label={txt.forms.password}
                        id='password'
                        type='password'
                        value={form.password}
                        onChange={handleChange('password')}
                        required
                    />
                    <FormField
                        label={txt.forms.repeatPassword}
                        id='passwordRepeat'
                        type='password'
                        value={form.passwordRepeat}
                        onChange={handleChange('passwordRepeat')}
                        required
                    />
                    {registered ? (
                        <p className='text-lg font-semibold uppercase text-dark-green'>
                            {txt.register.success}
                        </p>
                    ) : (
                        <ErrorMessage errorMessage={getErrorMessage()} />
                    )}
                    <div className='mx-auto flex max-w-xl flex-wrap justify-center gap-4 [&>button]:flex-1 [&>button]:min-w-[240px]'>
                        <ActionButton
                            label={txt.forms.register}
                            onClick={handleSubmit}
                            disabled={isFormInvalid}
                            loading={isSubmitting}
                        />
                        <ActionButton
                            label={txt.register.hasAccountText}
                            onClick={redirectToLogin}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterForm;
