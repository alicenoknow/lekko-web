'use client';

import BaseButton from '@/components/buttons/BaseButton';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/contexts/AuthContext';
import { TextContext } from '@/contexts/TextContext';
import { ErrorMessage } from '@/components/error/error';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        fillAllInfo,
        loginHeader,
        loginError,
        passwordText,
        emailText,
        sendText,
        noAccountText,
    } = useContext(TextContext);
    const { setToken } = useContext(AuthContext);

    const router = useRouter();

    const handleSubmit = async () => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/login`, // TODO: verify public env variable security
                {
                    email,
                    password,
                }
            );
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
            router.push('/user');
        } catch (error: unknown) {
            // TODO: handle error type
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.response?.data);
            } else {
                console.error('Unknown error:', error);
            }
            setToken(null);
            localStorage.removeItem('token');
            setErrorMessage(loginError);
        }
    };

    const checkIfFormInvalid = () => !email || !password || password.length < 6;

    const redirectToRegister = () => router.replace('register');

    const maybeRenderError = () => {
        if (checkIfFormInvalid()) {
            return <ErrorMessage errorMessage={fillAllInfo} />;
        } else if (errorMessage) {
            return <ErrorMessage errorMessage={errorMessage} />;
        }
    };

    return (
        <div className='m-auto flex flex-col p-4'>
            <p className='mb-12 text-2xl font-bold uppercase tracking-tight text-primaryDark'>
                REGISTER
            </p>
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

export default LoginForm;
