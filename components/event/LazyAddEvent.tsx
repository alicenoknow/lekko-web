'use client';

import { lazy, Suspense } from 'react';
import Spinner from '@/components/Spinner';

const AddEvent = lazy(() => import('./AddEvent'));

interface LazyAddEventProps {
    onEventAdd: () => void;
}

export default function LazyAddEvent(props: LazyAddEventProps) {
    return (
        <Suspense fallback={<Spinner />}>
            <AddEvent {...props} />
        </Suspense>
    );
}
