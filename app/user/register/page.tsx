'use client';

import { RegisterData, registerUser } from '@/app/api/auth';
import { ApiErrorType, handleError } from '@/app/api/errors';
import { isSuccess } from '@/app/api/common';
import { ErrorMessage } from '@/components/error/error';
import { useRouter } from 'next/navigation';
import React, { useCallback, useMemo, useState, useTransition } from 'react';
import { AxiosResponse } from 'axios';
import { txt as txtData } from '@/nls/texts';
import { ActionButton } from '@/components/buttons';
import FormField from '@/components/forms/FormField';

function RegisterForm() {
    const txt = useMemo(() => txtData, []);
    const [isPendingSubmit, startSubmitTransition] = useTransition();
    const [isPendingRedirect, startRedirectTransition] = useTransition();
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [registered, setRegistered] = useState(false);

    const checkIfFormInvalid = useCallback(
        () =>
            !username ||
            !email ||
            !password ||
            !passwordRepeat ||
            password !== passwordRepeat ||
            password.length < 6,
        [username, email, password, passwordRepeat]
    );

    const maybeRenderError = useCallback(() => {
        if (checkIfFormInvalid()) {
            return <ErrorMessage errorMessage={txt.forms.fillAllInfo} />;
        } else if (errorMessage) {
            return <ErrorMessage errorMessage={errorMessage} />;
        }
    }, [errorMessage, txt, checkIfFormInvalid]);

    const handleSubmit = useCallback(() => {
        setRegistered(false);
        setErrorMessage('');

        startSubmitTransition(async () => {
            try {
                const response = await registerUser(email, password);
                if (isSuccess<RegisterData>(response)) {
                    setRegistered(true);
                } else {
                    const error = (response as AxiosResponse<ApiErrorType>)
                        .data;
                    setErrorMessage(handleError(error));
                }
            } catch (err) {
                setErrorMessage(handleError());
            }
        });
    }, [email, password]);

    const redirectToLogin = useCallback(() => {
        startRedirectTransition(() => {
            router.replace('login');
        });
    }, [router]);

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
                disabled={checkIfFormInvalid()}
                onClick={handleSubmit}
                loading={isPendingSubmit}
            />
            <div className='mt-6' />
            <ActionButton
                label={txt.register.hasAccountText}
                onClick={redirectToLogin}
                loading={isPendingRedirect}
            />
        </div>
    );
}

export default RegisterForm;
