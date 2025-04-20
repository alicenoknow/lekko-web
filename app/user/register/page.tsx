'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '@/app/api/auth';
import { txt } from '@/nls/texts';
import ActionButton from '@/components/buttons/ActionButton';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import FormField from '@/components/forms/FormField';

function RegisterForm() {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [registered, setRegistered] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    const isFormInvalid = useMemo(() => {
        return (
            !username ||
            !email ||
            !password ||
            !passwordRepeat ||
            password.length < 6 ||
            password !== passwordRepeat
        );
    }, [username, email, password, passwordRepeat]);

    const { mutate: register, isPending: isSubmitting } = useMutation({
        mutationFn: () => registerUser(email, username, password),
        onSuccess: () => {
            setRegistered(true);
        },
        onError: (err) => {
            console.error('Register error:', err.message);
            setErrorMessage('Nie udało się zarejstrować. Spróbuj ponownie.');
        },
    });

    const maybeRenderError = () => {
        if (password && passwordRepeat && password !== passwordRepeat) {
            return (
                <ErrorMessage errorMessage={txt.register.passwordMismatch} />
            );
        }
        if (isFormInvalid) {
            return <ErrorMessage errorMessage={txt.forms.fillAllInfo} />;
        }
        if (errorMessage) {
            return <ErrorMessage errorMessage={errorMessage} />;
        }
        return null;
    };

    const handleSubmit = () => {
        setErrorMessage('');
        setRegistered(false);
        register();
    };

    const redirectToLogin = () => {
        setIsRedirecting(true);
        router.replace('/user/login');
    };

    return (
        <div className='m-auto flex flex-col justify-center p-4'>
            <p className='mb-12 text-2xl font-bold uppercase tracking-tight text-primaryDark'>
                {txt.register.header}
            </p>

            <FormField
                label={txt.forms.username}
                id='username'
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <FormField
                label={txt.forms.email}
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <FormField
                label={txt.forms.password}
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <FormField
                label={txt.forms.repeatPassword}
                id='passwordRepeat'
                type='password'
                value={passwordRepeat}
                onChange={(e) => setPasswordRepeat(e.target.value)}
                required
            />

            {registered ? (
                <p className='mb-6 text-lg font-semibold uppercase text-green-700'>
                    {txt.register.success}
                </p>
            ) : (
                maybeRenderError()
            )}

            <ActionButton
                label={txt.forms.send}
                disabled={isFormInvalid}
                onClick={handleSubmit}
                loading={isSubmitting}
            />
            <div className='mt-6' />
            <ActionButton
                label={txt.register.hasAccountText}
                onClick={redirectToLogin}
                loading={isRedirecting}
            />
        </div>
    );
}

export default React.memo(RegisterForm);
