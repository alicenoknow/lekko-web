'use client';

import BaseButton from '@/components/buttons/BaseButton';
import React, { useState } from 'react';

function RegisterForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');

    const checkIfFormInvalid = () =>
        !username ||
        !password ||
        !passwordRepeat ||
        !passwordRepeat ||
        password != passwordRepeat;

    const maybeRenderError = () => {
        if (checkIfFormInvalid()) {
            return (
                <p className='mt-6 text-wrap text-base font-semibold uppercase text-red-500 md:text-lg'>
                    Wypełnij wszystkie pola poprawnie
                </p>
            );
        }
    };

    const handleSubmit = () => {
        // Perform login logic here, such as sending the credentials to a server
        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <div className='m-auto flex flex-col justify-center p-4'>
            <p className='mb-12 text-2xl font-bold uppercase tracking-tight text-primaryDark'>
                Rejestracja
            </p>
            <div className='mb-4 flex items-center justify-between'>
                <label
                    className='mr-4 text-sm font-bold uppercase text-primaryDark md:mr-12 md:text-xl'
                    htmlFor='email'
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
            <div className='mb-4 flex items-center justify-between'>
                <label
                    className='mr-4 text-sm font-bold uppercase text-primaryDark md:mr-12 md:text-xl'
                    htmlFor='email'
                >
                    Email:
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
                    Hasło:
                </label>
                <input
                    className='p-2 text-sm text-primaryDark md:p-4 md:text-xl '
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
                    Powtórz hasło:
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
            <BaseButton
                label='Wyślij'
                disabled={checkIfFormInvalid()}
                onClick={handleSubmit}
            />
            {maybeRenderError()}
        </div>
    );
}

export default RegisterForm;
