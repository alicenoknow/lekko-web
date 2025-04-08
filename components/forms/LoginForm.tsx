'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorMessage } from '@/components/error/error';
import { signIn } from 'next-auth/react';
import { txt as txtData } from '@/nls/texts';
import { ActionButton } from '@/components/buttons';
import FormField from './FormField';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const txt = useMemo(() => txtData, []);
    const router = useRouter();

    const handleSubmit = useCallback(async () => {
        if (!email || !password) return;

        setErrorMessage('');
        setIsSubmitting(true);

        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        setIsSubmitting(false);

        if (result?.error) {
            setErrorMessage('Nie udało się zalogować. Spróbuj ponownie.');
        } else if (result?.ok) {
            router.replace('/user');
        }
    }, [email, password, router]);

    const checkIfFormInvalid = useCallback(
        () => !email || !password || password.length < 6,
        [email, password]
    );

    const redirectToRegister = useCallback(() => {
        setIsRedirecting(true);
        router.replace('register');
    }, [router]);

    const maybeRenderError = useCallback(() => {
        if (checkIfFormInvalid()) {
            return <ErrorMessage errorMessage={txt.forms.fillAllInfo} />;
        } else if (errorMessage) {
            return <ErrorMessage errorMessage={errorMessage} />;
        }
    }, [errorMessage, checkIfFormInvalid, txt.forms.fillAllInfo]);

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
