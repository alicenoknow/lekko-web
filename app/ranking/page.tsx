'use client';

import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { fetchEvents } from '@/lib/api/events';
import { fetchRankingFromEvent } from '@/lib/api/ranking';
import { TyperEvent } from '@/types/events';
import DropdownField from '@/components/forms/DropdownField';
import UserRank from '@/components/ranking/UserRank';
import Spinner from '@/components/Spinner';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import { txt } from '@/nls/texts';
import Label from '@/components/forms/Label';
import Pagination from '@/components/buttons/Pagination';

export default function Ranking() {
    const [eventId, setEventId] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const { token } = useAuthenticatedUser();

    const {
        data: events,
        isLoading: isLoadingEvents,
        isError: isEventsError,
    } = useQuery({
        queryKey: ['events'],
        queryFn: () => fetchEvents(token),
        enabled: !!token,
        staleTime: 10 * 60 * 1000,
    });

    const {
        data: ranking,
        isLoading: isLoadingRanking,
        isError: isRankingError,
    } = useQuery({
        queryKey: ['ranking', page, eventId],
        queryFn: () => fetchRankingFromEvent(token, eventId, page),
        enabled: !!token,
        staleTime: 10 * 60 * 1000,
    });

    const eventsOptions = useMemo(
        () =>
            events?.data.map((event: TyperEvent) => ({
                label: <Label label={event.name} />,
                value: String(event.id),
            })) ?? [],
        [events?.data]
    );

    if (isLoadingRanking || isLoadingEvents) {
        return <Spinner />;
    }
    if (isRankingError || isEventsError || !events?.data || !ranking?.data) {
        return <ErrorMessage errorMessage={txt.errors.rankingError} />;
    }
    return (
        <>
            <span className='text-3xl font-bold'>{txt.ranking.title}</span>
            <div className='mt-4 flex flex-row gap-4'>
                <Label label={txt.ranking.selectEvent} />
                <DropdownField
                    options={eventsOptions}
                    selected={eventId}
                    placeholder={txt.ranking.all}
                    onSelect={setEventId}
                />
            </div>
            {ranking?.data.map(
                (
                    rank: { username: string; total_points: number },
                    i: number
                ) => (
                    <UserRank
                        key={i}
                        index={i + 1}
                        username={rank.username}
                        points={rank.total_points}
                    />
                )
            )}
            <Pagination
                pagination={ranking.pagination_info}
                changePage={setPage}
            />
        </>
    );
}
