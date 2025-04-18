'use client';

import React, { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import { txt } from '@/nls/texts';
import { ActionButton } from '@/components/buttons';
import { useUserStore } from '@/store/user';
import { LoginData, loginUser } from '@/app/api/auth';
import FormField from '@/components/forms/FormField';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isRedirecting, setIsRedirecting] = useState(false);
    const router = useRouter();
    const { setUserFromToken } = useUserStore();

    const { mutate: login, isPending: isSubmitting } = useMutation({
        mutationFn: () => loginUser(email, password),
        onSuccess: (data: LoginData) => {
            setUserFromToken(data.token);
            router.replace('/user');
        },
        onError: (err) => {
            console.error('Login error:', err.message);
            setErrorMessage('Nie udało się zalogować. Spróbuj ponownie.');
        },
    });

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
                onClick={() => login()}
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

export default React.memo(LoginPage);
