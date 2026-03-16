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
import { AuthFormLayout } from '@/components/auth/AuthFormLayout';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [submitAttempted, setSubmitAttempted] = useState(false);

    const router = useRouter();
    const { setUserFromToken } = useUserStore();

    const isFormInvalid = useMemo(
        () => !email || !password || password.length < 6,
        [email, password]
    );

    const { mutate: login, isPending: isSubmitting } = useMutation({
        mutationFn: () => loginUser(email, password),
        onSuccess: async (data: LoginData) => {
            const authenticated = await setUserFromToken(
                data.access_token,
                data.refresh_token
            );
            if (authenticated) {
                router.replace('/typer');
            } else {
                setErrorMessage(txt.errors.badAuth);
            }
        },
        onError: (err) =>
            setErrorMessage(typeof err === 'string' ? err : txt.login.error),
    });

    const handleSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setSubmitAttempted(true);
            if (!isFormInvalid) login();
        },
        [isFormInvalid, login]
    );

    const handleRegisterRedirect = useCallback(() => {
        router.replace('/user/register');
    }, [router]);

    const validationMessage = submitAttempted && isFormInvalid
        ? txt.forms.fillAllInfo
        : '';

    return (
        <AuthFormLayout
            title={txt.login.header}
            onSubmit={handleSubmit}
            actions={
                <>
                    <ActionButton
                        label={txt.forms.login}
                        type='submit'
                        loading={isSubmitting}
                        disabled={isFormInvalid}
                    />
                    <ActionButton
                        label={txt.login.noAccountText}
                        onClick={handleRegisterRedirect}
                        type='button'
                    />
                </>
            }
        >
            <FormField
                label={txt.forms.email}
                id='email'
                type='email'
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage('');
                }}
                required
            />
            <FormField
                label={txt.forms.password}
                id='password'
                type='password'
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage('');
                }}
                required
            />
            <ErrorMessage errorMessage={validationMessage || errorMessage} />
        </AuthFormLayout>
    );
}

export default LoginPage;
