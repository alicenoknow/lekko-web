'use client';

import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchRanking } from '@/lib/api/ranking';
import { fetchCurrentUserRanking } from '@/lib/api/users';
import { fetchEvents } from '@/lib/api/events';
import { UserRank as UserRankType } from '@/types/ranking';
import { TyperEvent } from '@/types/events';
import UserRank from '@/components/ranking/UserRank';
import UserStats from '@/components/ranking/UserStats';
import Spinner from '@/components/Spinner';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import { txt } from '@/nls/texts';
import Pagination from '@/components/buttons/Pagination';
import DropdownField from '@/components/forms/DropdownField';

export default function Ranking() {
    const [page, setPage] = useState(1);
    const { user, token } = useAuthenticatedUser();
    const searchParams = useSearchParams();
    const router = useRouter();
    const eventIdParam = searchParams.get('eventId');
    const eventId = eventIdParam ? parseInt(eventIdParam, 10) : undefined;

    const { data: eventsData } = useQuery({
        queryKey: ['events', 'all'],
        queryFn: () => fetchEvents(token),
        enabled: !!token,
        staleTime: 5 * 60 * 1000,
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

    const events = eventsData?.data ?? [];
    const selectedEvent = eventId
        ? events.find((e: TyperEvent) => e.id === eventId)
        : undefined;
    const userPoints =
        userRanking?.total_points_scored ?? userRanking?.total_points;
    const userPlace = userRanking?.place ?? userRanking?.position;
    const shouldShowUserSummary =
        userPoints !== undefined &&
        userPoints !== null &&
        userPlace !== undefined &&
        userPlace !== null;
    const normalizedCurrentUsername = user.username.trim().toLowerCase();

    const eventOptions = events.map((e: TyperEvent) => ({
        value: String(e.id),
        label: e.name,
    }));

    function handleEventSelect(val: string | null) {
        setPage(1);
        if (!val) {
            router.push('/ranking');
        } else {
            router.push(`/ranking?eventId=${val}`);
        }
    }

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
                <div className='flex items-start justify-between gap-4'>
                    <span className='text-left text-3xl font-bold'>
                        {selectedEvent ? selectedEvent.name : txt.ranking.title}
                    </span>
                    {shouldShowUserSummary && (
                        <UserStats place={userPlace} points={userPoints} />
                    )}
                </div>
                <DropdownField
                    options={eventOptions}
                    selected={eventId ? String(eventId) : null}
                    onSelect={handleEventSelect}
                    placeholder={txt.ranking.all}
                />
            </div>
            {isFetching && (
                <div className='fixed inset-0 flex items-center justify-center'>
                    <Spinner />
                </div>
            )}
            {!isFetching && ranking.data.length === 0 && eventId ? (
                <p className='text-grey mt-4 text-center'>
                    {txt.ranking.noRanking}
                </p>
            ) : !isFetching ? (
                <>
                    {ranking.data.map((rank: UserRankType, i: number) => (
                        <UserRank
                            key={rank.user_id ?? i}
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
                    {ranking.total_count > ranking.limit && (
                        <Pagination pagination={ranking} changePage={setPage} />
                    )}
                </>
            ) : null}
        </>
    );
}
