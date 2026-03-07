'use client';

import React from 'react';
import { txt } from '@/nls/texts';
import { logger } from '@/lib/logger';

interface Props {
    children: React.ReactNode;
    fallback?: React.ComponentType<ErrorFallbackProps>;
}

interface ErrorFallbackProps {
    error: Error;
    resetError: () => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ resetError }) => (
    <section className='mx-auto flex min-h-[75vh] w-full flex-col items-center justify-center gap-6 px-6 py-12 text-center'>
        <h1 className='text-primary-dark text-2xl font-bold uppercase md:text-3xl'>
            {txt.errors.errorMessage}
        </h1>
        <div className='flex gap-4'>
            <button
                onClick={resetError}
                className='bg-primary-light hover:bg-accent-light rounded-lg border-2 border-black p-3 text-base font-extrabold uppercase select-none hover:cursor-pointer sm:px-6 sm:text-lg md:px-8 md:text-xl'
            >
                {txt.errors.tryAgain}
            </button>
            <button
                onClick={() => (window.location.href = '/')}
                className='bg-primary-light hover:bg-accent-light rounded-lg border-2 border-black p-3 text-base font-extrabold uppercase select-none hover:cursor-pointer sm:px-6 sm:text-lg md:px-8 md:text-xl'
            >
                {txt.errors.goHome}
            </button>
        </div>
    </section>
);

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    override componentDidCatch(error: Error) {
        logger.error('Error boundary caught an error', error);
    }

    resetError = () => {
        this.setState({ hasError: false, error: null });
    };

    override render() {
        if (this.state.hasError && this.state.error) {
            const FallbackComponent =
                this.props.fallback || DefaultErrorFallback;
            return (
                <FallbackComponent
                    error={this.state.error}
                    resetError={this.resetError}
                />
            );
        }

        return this.props.children;
    }
}

export function withErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
    fallback?: React.ComponentType<ErrorFallbackProps>
) {
    const WrappedComponent = (props: P) => (
        <ErrorBoundary {...(fallback !== undefined ? { fallback } : {})}>
            <Component {...props} />
        </ErrorBoundary>
    );

    WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
    return WrappedComponent;
}
