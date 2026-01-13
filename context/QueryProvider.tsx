'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Don't refetch data when the window regains focus by default
            refetchOnWindowFocus: false,
            // Don't retry failed requests by default (can be overridden per query)
            retry: 1,
            // Cache data for 5 minutes by default
            staleTime: 5 * 60 * 1000,
            // Keep unused data in cache for 10 minutes
            gcTime: 10 * 60 * 1000,
        },
        mutations: {
            // Show error on mutation failure
            retry: 0,
        },
    },
});

export default function QueryProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
