'use client';

import React from 'react';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';
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

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
    error,
    resetError,
}) => (
    <div className='flex min-h-screen items-center justify-center bg-lightRed p-4'>
        <div className='w-full max-w-lg rounded-lg bg-white p-8 shadow-xl'>
            <div className='flex flex-col items-center gap-6 text-center'>
                <FaExclamationTriangle size={48} className='text-darkRed' />
                <div>
                    <h1 className='mb-2 text-2xl font-bold text-primaryDark'>
                        Oops! Something went wrong
                    </h1>
                    <p className='mb-4 text-gray-600'>
                        {txt.errors.errorMessage}
                    </p>
                    {process.env.NODE_ENV === 'development' && (
                        <details className='mb-4 rounded bg-gray-100 p-3 text-left text-sm'>
                            <summary className='cursor-pointer font-medium'>
                                Error Details
                            </summary>
                            <pre className='mt-2 whitespace-pre-wrap break-words text-red-600'>
                                {error.message}
                                {error.stack}
                            </pre>
                        </details>
                    )}
                </div>
                <div className='flex gap-4'>
                    <button
                        onClick={resetError}
                        className='flex items-center gap-2 rounded bg-primaryDark px-4 py-2 text-white hover:bg-opacity-90'
                    >
                        <FaRedo size={16} />
                        Try Again
                    </button>
                    <button
                        onClick={() => (window.location.href = '/')}
                        className='rounded border border-primaryDark px-4 py-2 text-primaryDark hover:bg-gray-50'
                    >
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error) {
        logger.error('Error boundary caught an error', error);
    }

    resetError = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
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
        <ErrorBoundary fallback={fallback}>
            <Component {...props} />
        </ErrorBoundary>
    );

    WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
    return WrappedComponent;
}
