'use client';

import BaseButton from '@/components/buttons/BaseButton';
import React, { useCallback, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/contexts/AuthContext';
import { TextContext } from '@/contexts/TextContext';
import { ErrorMessage } from '@/components/error/error';
import { loginUser, LoginData } from '@/api/auth';
import { isSuccess } from '@/api/common';

import { ApiErrorType, handleError } from '@/api/errors';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const {
        fillAllInfo,
        loginHeader,
        passwordText,
        emailText,
        sendText,
        noAccountText,
    } = useContext(TextContext);
    const { setToken } = useContext(AuthContext);
    const router = useRouter();

    const handleSubmit = useCallback(async () => {
        setErrorMessage('');
        try {
            const response = await loginUser(email, password);
            if (isSuccess<LoginData>(response)) {
                setToken(response.data.token);
                router.replace('/user');
            } else {
                const error = response.data as ApiErrorType;
                setErrorMessage(handleError(error));
            }
        } catch (err) {
            setErrorMessage(handleError());
        }
    }, [email, password]);

    const checkIfFormInvalid = useCallback(
        () => !email || !password || password.length < 6,
        [email, password]
    );
    const redirectToRegister = useCallback(
        () => router.replace('register'),
        [router]
    );

    const maybeRenderError = useCallback(() => {
        if (checkIfFormInvalid()) {
            return <ErrorMessage errorMessage={fillAllInfo} />;
        } else if (errorMessage) {
            return <ErrorMessage errorMessage={errorMessage} />;
        }
    }, [errorMessage, fillAllInfo, checkIfFormInvalid]);

    return (
        <div className='m-auto flex flex-col p-4'>
            <p className='mb-12 text-2xl font-bold uppercase tracking-tight text-primaryDark'>
                {loginHeader}
            </p>
            <div className='mb-4 flex items-center justify-between'>
                <label
                    className='mr-4 text-sm font-bold uppercase text-primaryDark md:mr-12 md:text-xl'
                    htmlFor='email'
                >
                    {emailText}:
                </label>
                <input
                    className='p-2 text-sm text-primaryDark md:p-4 md:text-xl'
                    type='email'
                    id='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className='mb-16 flex items-center justify-between'>
                <label
                    className='mr-4 text-sm font-bold uppercase text-primaryDark md:mr-12 md:text-xl'
                    htmlFor='password'
                >
                    {passwordText}:
                </label>
                <input
                    className='p-2 text-sm text-primaryDark md:p-4 md:text-xl'
                    type='password'
                    id='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            {maybeRenderError()}
            <BaseButton
                label={sendText}
                onClick={handleSubmit}
                disabled={checkIfFormInvalid()}
            />
            <div className='mt-6' />
            <BaseButton label={noAccountText} onClick={redirectToRegister} />
        </div>
    );
}

export default React.memo(LoginForm);
