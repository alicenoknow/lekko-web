'use client';

import { Suspense } from 'react';
import { useCallback, useMemo } from 'react';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import {
    keepPreviousData,
    useInfiniteQuery,
    useQuery,
} from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchRanking } from '@/lib/api/ranking';
import { fetchCurrentUserRanking } from '@/lib/api/users';
import { fetchEvents } from '@/lib/api/events';
import { TyperEvent } from '@/types/events';
import UserRank from '@/components/ranking/UserRank';
import UserStats from '@/components/ranking/UserStats';
import Spinner from '@/components/Spinner';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import { txt } from '@/nls/texts';
import Pagination from '@/components/buttons/Pagination';
import DropdownField from '@/components/forms/DropdownField';

function parsePositiveInt(value: string | null): number | undefined {
    if (!value) return undefined;
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) || parsed <= 0 ? undefined : parsed;
}

function buildRankingUrl(params: {
    page?: number;
    eventId?: number | undefined;
}) {
    const p = new URLSearchParams();
    if (params.eventId !== undefined) p.set('eventId', String(params.eventId));
    if (params.page !== undefined && params.page > 1)
        p.set('page', String(params.page));
    const qs = p.toString();
    return qs ? `/ranking?${qs}` : '/ranking';
}

function RankingContent() {
    const { user, token } = useAuthenticatedUser();
    const searchParams = useSearchParams();
    const router = useRouter();

    const eventIdParam = searchParams.get('eventId');
    const pageParam = searchParams.get('page');

    const eventId = useMemo(
        () => parsePositiveInt(eventIdParam),
        [eventIdParam]
    );
    const page = useMemo(() => parsePositiveInt(pageParam) ?? 1, [pageParam]);

    const handleEventSelect = useCallback(
        (val: string | null) => {
            if (!val) {
                router.push(buildRankingUrl({ eventId: undefined }));
                return;
            }

            const parsedEventId = Number.parseInt(val, 10);
            if (!Number.isFinite(parsedEventId)) {
                router.push('/ranking');
                return;
            }

            router.push(
                buildRankingUrl({
                    eventId: parsedEventId,
                })
            );
        },
        [router]
    );

    const handlePageChange = useCallback(
        (newPage: number) => {
            router.push(buildRankingUrl({ page: newPage, eventId }));
        },
        [router, eventId]
    );

    const {
        data: eventsData,
        isError: isEventsError,
        hasNextPage: hasNextEventsPage,
        isFetchingNextPage: isFetchingNextEventsPage,
        fetchNextPage: fetchNextEventsPage,
    } = useInfiniteQuery({
        queryKey: ['events', 'all'],
        queryFn: ({ pageParam }) => fetchEvents(token, pageParam),
        enabled: !!token,
        staleTime: 5 * 60 * 1000,
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.pagination_info.next_page ?? undefined,
    });

    const {
        data: ranking,
        isLoading,
        isFetching,
        isError,
    } = useQuery({
        queryKey: ['ranking', page, eventId],
        queryFn: () => fetchRanking(token, page, eventId),
        enabled: !!token,
        staleTime: 10 * 60 * 1000,
        placeholderData: keepPreviousData,
    });

    const { data: userRanking } = useQuery({
        queryKey: ['userRanking', 'me', eventId],
        queryFn: () => fetchCurrentUserRanking(token, eventId),
        enabled: !!token,
        staleTime: 10 * 60 * 1000,
    });

    const events = useMemo(
        () => eventsData?.pages.flatMap((eventsPage) => eventsPage.data) ?? [],
        [eventsData]
    );
    const selectedEvent = eventId
        ? events.find((e: TyperEvent) => e.id === eventId)
        : undefined;
    const normalizedCurrentUsername = user.username.trim().toLowerCase();

    const eventOptions = events.map((e: TyperEvent) => ({
        value: String(e.id),
        label: e.name,
    }));

    if (isLoading) {
        return (
            <div className='fixed inset-0 flex items-center justify-center'>
                <Spinner />
            </div>
        );
    }

    if (isError || !ranking?.data) {
        return <ErrorMessage errorMessage={txt.errors.rankingError} />;
    }

    return (
        <>
            <div className='mt-6 mb-4 flex flex-col gap-4'>
                <div className='flex min-h-[72px] items-start justify-between gap-4'>
                    <span className='text-left text-3xl font-bold'>
                        {selectedEvent ? selectedEvent.name : txt.ranking.title}
                    </span>
                    <UserStats
                        place={userRanking?.place}
                        points={userRanking?.totalPoints}
                    />
                </div>
                <DropdownField
                    options={eventOptions}
                    selected={eventId ? String(eventId) : null}
                    onSelect={handleEventSelect}
                    placeholder={txt.ranking.all}
                    pagination={{
                        hasNextPage: !!hasNextEventsPage,
                        isFetchingNextPage: isFetchingNextEventsPage,
                        fetchNextPage: () => {
                            void fetchNextEventsPage();
                        },
                        autoFetchOnScrollEnd: true,
                        showLoadMoreAction: true,
                    }}
                />
                {isEventsError && (
                    <p className='text-dark-red text-left text-sm'>
                        {txt.fetchErrorText}
                    </p>
                )}
            </div>

            {!isFetching && ranking.data.length === 0 ? (
                <p className='text-grey mt-4 text-center'>
                    {eventId ? txt.ranking.noRanking : txt.ranking.noRankingAll}
                </p>
            ) : (
                <div
                    className={`flex flex-col gap-2 transition-opacity duration-200 ${isFetching ? 'pointer-events-none opacity-50' : ''}`}
                >
                    {ranking.data.map((rank, i) => (
                        <UserRank
                            key={
                                rank.user_id != null
                                    ? `user-${rank.user_id}`
                                    : `rank-${rank.position ?? i + 1}-${rank.username}`
                            }
                            index={rank.position ?? i + 1}
                            username={rank.username}
                            points={rank.total_points}
                            isCurrentUser={
                                rank.user_id === user.sub ||
                                rank.username.trim().toLowerCase() ===
                                    normalizedCurrentUsername
                            }
                        />
                    ))}
                    {!ranking.pagination_info.is_last_page && (
                        <Pagination
                            pagination={ranking.pagination_info}
                            changePage={handlePageChange}
                        />
                    )}
                </div>
            )}
        </>
    );
}

export default function RankingPage() {
    return (
        <Suspense
            fallback={
                <div className='fixed inset-0 flex items-center justify-center'>
                    <Spinner />
                </div>
            }
        >
            <RankingContent />
        </Suspense>
    );
}
