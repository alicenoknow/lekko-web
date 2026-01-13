'use client';

import React, { lazy, Suspense } from 'react';
import Spinner from '@/components/Spinner';

// Lazy load AddEvent since it's only used by admins
const AddEvent = lazy(() => import('./AddEvent'));

interface LazyAddEventProps {
    onEventAdd: () => void;
}

export default function LazyAddEvent(props: LazyAddEventProps) {
    return (
        <Suspense fallback={<Spinner isInline />}>
            <AddEvent {...props} />
        </Suspense>
    );
}
