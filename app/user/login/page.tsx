'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import { useUserStore } from '@/store/user';
import { loginUser, LoginData } from '@/app/api/auth';

import { txt } from '@/nls/texts';
import FormField from '@/components/forms/FormField';
import ActionButton from '@/components/buttons/ActionButton';
import { ErrorMessage } from '@/components/error/ErrorMessage';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const router = useRouter();
    const { setUserFromToken } = useUserStore();

    const isFormInvalid = useMemo(
        () => !email || !password || password.length < 6,
        [email, password]
    );

    const { mutate: login, isPending: isSubmitting } = useMutation({
        mutationFn: () => loginUser(email, password),
        onSuccess: (data: LoginData) => {
            setUserFromToken(data.token);
            router.replace('/user');
        },
        onError: () => setErrorMessage(txt.login.error),
    });

    const handleLogin = useCallback(() => {
        if (!isFormInvalid) login();
    }, [login, isFormInvalid]);

    const handleRegisterRedirect = useCallback(() => {
        router.replace('/user/register');
    }, [router]);

    return (
        <div className='m-auto flex w-full max-w-md flex-col justify-center space-y-6 p-4'>
            <h1 className='text-2xl font-bold uppercase tracking-tight text-primaryDark'>
                {txt.login.header}
            </h1>
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
            {isFormInvalid && (
                <ErrorMessage errorMessage={txt.forms.fillAllInfo} />
            )}
            {!isFormInvalid && errorMessage && (
                <ErrorMessage errorMessage={errorMessage} />
            )}
            <ActionButton
                label={txt.forms.send}
                onClick={handleLogin}
                loading={isSubmitting}
                disabled={isFormInvalid}
            />
            <ActionButton
                label={txt.login.noAccountText}
                onClick={handleRegisterRedirect}
            />
        </div>
    );
}

export default LoginPage;
