'use client';

import React, { lazy, Suspense } from 'react';
import { useErrorStore } from '@/store/error';

// Lazy load ErrorDialog since it's only shown when there are errors
const ErrorDialog = lazy(() => import('./ErrorDialog'));

export default function LazyErrorDialog() {
    const { isDialogVisible } = useErrorStore();

    // Don't render anything if dialog is not visible
    if (!isDialogVisible) {
        return null;
    }

    return (
        <Suspense fallback={null}>
            <ErrorDialog />
        </Suspense>
    );
}
