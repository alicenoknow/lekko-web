'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import { txt } from '@/nls/texts';
import { ActionButton } from '@/components/buttons';
import FormField from './FormField';
import { useUserStore } from '@/store/user';
import { loginUser } from '@/app/api/auth';
import { AxiosResponse } from 'axios';
import { ApiErrorType, handleError } from '@/app/api/errors';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const router = useRouter();
    const { setUserFromToken } = useUserStore();

    const handleSubmit = useCallback(async () => {
        if (!email || !password) return;
        setErrorMessage('');
        setIsSubmitting(true);

        try {
            const response = await loginUser(email, password);

            if (response.status === 200 && 'token' in response.data) {
                const { token } = response.data;
                localStorage.setItem('token', token);
                setUserFromToken(token);
                router.replace('/user');
            } else {
                const error = (response as AxiosResponse<ApiErrorType>).data;
                setErrorMessage(handleError(error));
            }
        } catch (err: any) {
            setErrorMessage(
                err?.message || 'Nie udało się zalogować. Spróbuj ponownie.'
            );
        } finally {
            setIsSubmitting(false);
        }
    }, [email, password, router, setUserFromToken]);

    const checkIfFormInvalid = useCallback(
        () => !email || !password || password.length < 6,
        [email, password]
    );

    const redirectToRegister = useCallback(() => {
        setIsRedirecting(true);
        router.replace('/user/register');
    }, [router]);

    const maybeRenderError = () => {
        if (checkIfFormInvalid())
            return <ErrorMessage errorMessage={txt.forms.fillAllInfo} />;
        if (errorMessage) return <ErrorMessage errorMessage={errorMessage} />;
    };

    return (
        <div className='m-auto flex flex-col p-4'>
            <p className='mb-12 text-2xl font-bold uppercase tracking-tight text-primaryDark'>
                {txt.login.header}
            </p>
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
            {maybeRenderError()}
            <ActionButton
                label={txt.forms.send}
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={checkIfFormInvalid()}
            />
            <div className='mt-6' />
            <ActionButton
                label={txt.login.noAccountText}
                loading={isRedirecting}
                onClick={redirectToRegister}
            />
        </div>
    );
}

export default React.memo(LoginForm);
