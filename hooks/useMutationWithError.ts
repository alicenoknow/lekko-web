import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useErrorStore } from '@/store/error';
import { logger } from '@/lib/logger';

type MutationWithErrorOptions<TData, TError, TVariables, TContext> =
    UseMutationOptions<TData, TError, TVariables, TContext> & {
        errorMessage: string;
        errorLogMessage?: string;
    };

export function useMutationWithError<
    TData = unknown,
    TError = Error,
    TVariables = void,
    TContext = unknown,
>(options: MutationWithErrorOptions<TData, TError, TVariables, TContext>) {
    const { showErrorDialog } = useErrorStore();
    const { errorMessage, errorLogMessage, onError, ...rest } = options;

    return useMutation<TData, TError, TVariables, TContext>({
        ...rest,
        onError: (error, variables, context, mutation) => {
            logger.error(errorLogMessage ?? 'Mutation error', error);
            showErrorDialog(errorMessage);
            onError?.(error, variables, context, mutation);
        },
    });
}
