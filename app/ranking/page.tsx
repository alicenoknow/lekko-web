'use client';

import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchRanking } from '@/lib/api/ranking';
import { UserRank as UserRankType } from '@/types/ranking';
import UserRank from '@/components/ranking/UserRank';
import Spinner from '@/components/Spinner';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import { txt } from '@/nls/texts';
import Pagination from '@/components/buttons/Pagination';

export default function Ranking() {
    const [page, setPage] = useState(1);
    const { token } = useAuthenticatedUser();

    const {
        data: ranking,
        isLoading: isLoadingRanking,
        isError: isRankingError,
    } = useQuery({
        queryKey: ['ranking', page],
        queryFn: () => fetchRanking(token, page),
        enabled: !!token,
        staleTime: 10 * 60 * 1000,
    });

    if (isLoadingRanking) {
        return <Spinner />;
    }
    if (isRankingError || !ranking?.data) {
        return <ErrorMessage errorMessage={txt.errors.rankingError} />;
    }
    return (
        <>
            <span className='mt-6 mb-4 block text-3xl font-bold'>
                {txt.ranking.title}
            </span>
            {ranking.data.map((rank: UserRankType, i: number) => (
                <UserRank
                    key={rank.user_id ?? i}
                    index={rank.position ?? i + 1}
                    username={rank.username}
                    points={rank.total_points}
                />
            ))}
            {ranking.total_count > ranking.limit && (
                <Pagination pagination={ranking} changePage={setPage} />
            )}
        </>
    );
}
