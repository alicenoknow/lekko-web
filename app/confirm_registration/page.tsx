'use client';

import { useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import { verifyEmail, LoginData } from '@/lib/api/auth';
import { useUserStore } from '@/store/user';
import { txt } from '@/nls/texts';
import Spinner from '@/components/Spinner';
import ActionButton from '@/components/buttons/ActionButton';

function ConfirmRegistrationPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const { setUserFromToken } = useUserStore();

    const {
        mutate: verify,
        isPending,
        isSuccess,
        isError,
    } = useMutation({
        mutationFn: () => verifyEmail(token!),
        onSuccess: (data: LoginData) => {
            setUserFromToken(data.access_token, data.refresh_token);
            router.replace('/typer');
        },
    });

    useEffect(() => {
        if (token) verify();
    }, [token, verify]);

    const goHome = useCallback(() => router.replace('/'), [router]);

    return (
        <div className='bg-primary-light flex flex-1 items-center justify-center px-4 py-8 md:px-6 md:py-12'>
            <div className='w-full max-w-4xl'>
                <div className='flex w-full flex-col space-y-6'>
                    <h1 className='text-primary-dark text-2xl font-bold tracking-tight uppercase'>
                        {txt.confirmRegistration.header}
                    </h1>
                    {isPending && <Spinner />}
                    {!token && (
                        <>
                            <p className='text-lg font-semibold text-red-600 uppercase'>
                                {txt.confirmRegistration.missingToken}
                            </p>
                            <div className='mx-auto w-full max-w-xl'>
                                <ActionButton
                                    label={txt.confirmRegistration.goHome}
                                    onClick={goHome}
                                />
                            </div>
                        </>
                    )}
                    {isError && (
                        <>
                            <p className='text-lg font-semibold text-red-600 uppercase'>
                                {txt.confirmRegistration.error}
                            </p>
                            <div className='mx-auto w-full max-w-xl'>
                                <ActionButton
                                    label={txt.confirmRegistration.goHome}
                                    onClick={goHome}
                                />
                            </div>
                        </>
                    )}
                    {isSuccess && (
                        <p className='text-dark-green text-lg font-semibold uppercase'>
                            {txt.confirmRegistration.success}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ConfirmRegistrationPage;
