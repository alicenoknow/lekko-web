'use client';

import React, { lazy, Suspense } from 'react';
import Spinner from '@/components/Spinner';

// Lazy load ConfirmationDialog since it's only shown when needed
const ConfirmationDialog = lazy(() => import('./ConfirmationDialog'));

interface LazyConfirmationDialogProps {
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel: string;
    cancelLabel: string;
}

export default function LazyConfirmationDialog(
    props: LazyConfirmationDialogProps
) {
    // Don't render anything if dialog is closed to avoid loading
    if (!props.isOpen) {
        return null;
    }

    return (
        <Suspense
            fallback={
                <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black'>
                    <div className='bg-white p-8'>
                        <Spinner />
                    </div>
                </div>
            }
        >
            <ConfirmationDialog {...props} />
        </Suspense>
    );
}
