import LoginForm from '@/components/forms/LoginForm';
import React from 'react';

function LoginPage() {
    return (
        <div className='m-auto flex flex-col'>
            <p className='mb-12 text-xl font-semibold uppercase tracking-tight text-accentDark'>
                Rejstracja zakończona. Zaloguj się.
            </p>
            <LoginForm />
        </div>
    );
}

export default React.memo(LoginPage);
