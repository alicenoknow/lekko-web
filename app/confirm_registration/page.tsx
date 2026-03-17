'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { verifyEmail, LoginData } from '@/lib/api/auth';
import { useUserStore } from '@/store/user';
import { txt } from '@/nls/texts';
import Spinner from '@/components/Spinner';
import ActionButton from '@/components/buttons/ActionButton';

function ErrorBlock({
    message,
    onGoHome,
}: {
    message: string;
    onGoHome: () => void;
}) {
    return (
        <>
            <p className='mb-12 text-lg font-semibold text-red-600 uppercase'>
                {message}
            </p>
            <div className='mx-auto w-full max-w-xl'>
                <ActionButton
                    label={txt.confirmRegistration.goHome}
                    onClick={onGoHome}
                />
            </div>
        </>
    );
}

function ConfirmRegistrationContent() {
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
        mutationFn: (t: string) => verifyEmail(t),
        onSuccess: async (data: LoginData) => {
            await setUserFromToken(data.access_token, data.refresh_token);
            // router.replace('/typer');
        },
    });

    useEffect(() => {
        if (token) verify(token);
    }, [token, verify]);

    const goHome = () => router.replace('/');

    return (
        <div className='common-page-wrapper'>
            <div className='common-page-content'>
                <div className='common-page-stack'>
                    <h1 className='common-page-title'>
                        {txt.confirmRegistration.header}
                    </h1>
                    <div aria-live='polite'>
                        {isPending && <Spinner />}
                        {!token && (
                            <ErrorBlock
                                message={txt.confirmRegistration.missingToken}
                                onGoHome={goHome}
                            />
                        )}
                        {isError && (
                            <ErrorBlock
                                message={txt.confirmRegistration.error}
                                onGoHome={goHome}
                            />
                        )}
                        {isSuccess && (
                            <p className='text-dark-green text-lg font-semibold uppercase'>
                                {txt.confirmRegistration.success}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ConfirmRegistrationPage() {
    return (
        <Suspense
            fallback={
                <div className='common-page-wrapper'>
                    <div className='common-page-content'>
                        <Spinner />
                    </div>
                </div>
            }
        >
            <ConfirmRegistrationContent />
        </Suspense>
    );
}

export default ConfirmRegistrationPage;
