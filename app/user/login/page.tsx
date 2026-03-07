'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import { useUserStore } from '@/store/user';
import { loginUser, LoginData } from '@/lib/api/auth';

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
            setUserFromToken(data.access_token, data.refresh_token);
            router.replace('/typer');
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
        <div className='bg-primary-light flex flex-1 items-center justify-center px-4 py-8 md:px-6 md:py-12'>
            <div className='w-full max-w-4xl'>
                <div className='flex w-full flex-col space-y-6'>
                    <h1 className='text-2xl font-bold uppercase tracking-tight text-primary-dark'>
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
                    <ErrorMessage errorMessage={isFormInvalid ? txt.forms.fillAllInfo : errorMessage} />
                    <div className='mx-auto flex max-w-xl flex-wrap justify-center gap-4 [&>button]:flex-1 [&>button]:min-w-[240px]'>
                        <ActionButton
                            label={txt.forms.login}
                            onClick={handleLogin}
                            loading={isSubmitting}
                            disabled={isFormInvalid}
                        />
                        <ActionButton
                            label={txt.login.noAccountText}
                            onClick={handleRegisterRedirect}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
