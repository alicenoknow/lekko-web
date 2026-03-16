import { useQuery, keepPreviousData } from '@tanstack/react-query';

export function usePaginatedQuery<TData>(
    queryKey: unknown[],
    queryFn: () => Promise<TData>,
    token: string
) {
    return useQuery({
        queryKey,
        queryFn,
        enabled: !!token,
        placeholderData: keepPreviousData,
        staleTime: 10 * 60 * 1000,
    });
}
