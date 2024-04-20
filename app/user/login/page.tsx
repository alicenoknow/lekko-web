'use client';

import BaseButton from '@/components/buttons/BaseButton';
import React, { useState } from 'react';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        // Perform login logic here, such as sending the credentials to a server
        console.log('Username:', username);
        console.log('Password:', password);
    };

    const checkIfFormInvalid = () => !username || !password;

    const maybeRenderError = () => {
        if (checkIfFormInvalid()) {
            return (
                <p className='mt-6 text-lg font-semibold uppercase text-red-500'>
                    Wypełnij wszystkie pola
                </p>
            );
        }
    };

    return (
        <div className='m-auto flex flex-col p-4'>
            <p className='mb-12 text-2xl font-bold uppercase tracking-tight text-primaryDark'>
                Logowanie
            </p>
            <div className='mb-4 flex items-center justify-between'>
                <label
                    className='mr-4 text-sm font-bold uppercase text-primaryDark md:mr-12 md:text-xl'
                    htmlFor='username'
                >
                    Nazwa:
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
            <div className='mb-16 flex items-center justify-between'>
                <label
                    className='mr-4 text-sm font-bold uppercase text-primaryDark md:mr-12 md:text-xl'
                    htmlFor='email'
                >
                    Hasło:
                </label>
                <input
                    className='p-2 text-sm  text-primaryDark md:p-4 md:text-xl'
                    type='password'
                    id='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <BaseButton
                label='Wyślij'
                onClick={handleSubmit}
                disabled={checkIfFormInvalid()}
            />
            {maybeRenderError()}
        </div>
    );
}

export default LoginForm;
