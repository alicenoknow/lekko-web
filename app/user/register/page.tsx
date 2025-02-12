'use client';

import { registerUser } from '@/api/auth';
import BaseButton from '@/components/buttons/BaseButton';
import { ErrorMessage } from '@/components/error/error';
import { AuthContext } from '@/contexts/AuthContext';
import { TextContext } from '@/contexts/TextContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useCallback, useContext, useState } from 'react';

function RegisterForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const {
        fillAllInfo,
        registerHeader,
        usernameText,
        repeatPassword,
        passwordText,
        emailText,
        sendText,
        hasAccountText,
    } = useContext(TextContext);
    const { setToken } = useContext(AuthContext);

    const router = useRouter();

    const checkIfFormInvalid = useCallback(
        () =>
            !username ||
            !email ||
            !password ||
            !passwordRepeat ||
            password != passwordRepeat ||
            password.length < 6,
        [username, email, password, passwordRepeat]
    );

    const maybeRenderError = () => {
        if (checkIfFormInvalid()) {
            return <ErrorMessage errorMessage={fillAllInfo} />;
        } else if (errorMessage) {
            return <ErrorMessage errorMessage={errorMessage} />;
        }
    };

    const handleSubmit = async () => {
        const errorMessage = await registerUser(email, password);
        if (errorMessage != '') {
            setErrorMessage(errorMessage);
        } else {
            redirectToLogin();
        }
    };

    const redirectToLogin = useCallback(
        () => router.replace('login'),
        [router]
    );

    return (
        <div className='m-auto flex flex-col justify-center p-4'>
            <p className='mb-12 text-2xl font-bold uppercase tracking-tight text-primaryDark'>
                {registerHeader}
            </p>
            <div className='mb-4 flex items-center justify-between'>
                <label
                    className='mr-4 text-sm font-bold uppercase text-primaryDark md:mr-12 md:text-xl'
                    htmlFor='email'
                >
                    {usernameText}:
                </label>
                <input
                    className='p-2 text-sm text-primaryDark md:p-4 md:text-xl'
                    type='text'
                    id='username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
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
            <div className='mb-4 flex items-center justify-between'>
                <label
                    className='mr-4 text-sm font-bold uppercase text-primaryDark md:mr-12 md:text-xl'
                    htmlFor='email'
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
            <div className='mb-16 flex items-center justify-between'>
                <label
                    className='mr-4 text-wrap text-sm font-bold uppercase text-primaryDark md:mr-12 md:text-xl'
                    htmlFor='email'
                >
                    {repeatPassword}:
                </label>
                <input
                    className='p-2 text-sm text-primaryDark md:p-4 md:text-xl'
                    type='password'
                    id='password'
                    value={passwordRepeat}
                    onChange={(e) => setPasswordRepeat(e.target.value)}
                    required
                />
            </div>
            {maybeRenderError()}
            <BaseButton
                label={sendText}
                disabled={checkIfFormInvalid()}
                onClick={handleSubmit}
            />
            <div className='mt-6' />
            <BaseButton label={hasAccountText} onClick={redirectToLogin} />
        </div>
    );
}

export default RegisterForm;
