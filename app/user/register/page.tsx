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
import { AuthFormLayout } from '@/components/auth/AuthFormLayout';

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
    const [submitAttempted, setSubmitAttempted] = useState(false);

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
            setErrorMessage(typeof err === 'string' ? err : txt.register.error);
        },
    });

    const handleSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setSubmitAttempted(true);
            if (!isFormInvalid) register();
        },
        [isFormInvalid, register]
    );

    const redirectToLogin = useCallback(() => {
        router.replace('/user/login');
    }, [router]);

    const getErrorMessage = () => {
        if (form.password && form.passwordRepeat && form.password !== form.passwordRepeat)
            return txt.register.passwordMismatch;
        if (submitAttempted && isFormInvalid) return txt.forms.fillAllInfo;
        return errorMessage;
    };

    return (
        <AuthFormLayout
            title={txt.register.header}
            onSubmit={handleSubmit}
            actions={
                <>
                    <ActionButton
                        label={txt.forms.register}
                        type='submit'
                        disabled={isFormInvalid}
                        loading={isSubmitting}
                    />
                    <ActionButton
                        label={txt.register.hasAccountText}
                        onClick={redirectToLogin}
                        type='button'
                    />
                </>
            }
        >
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
        </AuthFormLayout>
    );
}

export default RegisterForm;
