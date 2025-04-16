'use client';

import { useState, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAth, Athlete } from '@/app/api/typer';
import Spinner from '@/components/Spinner';

interface Props {
  selected: Athlete | null;
  onSelect: (athlete: Athlete) => void;
}

export default function SearchableDropdown({ selected, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isFetching, fetchNextPage, isFetchingNextPage } = useQuery({
    queryKey: ['athletes', query, page],
    queryFn: () => fetchAthletes(query, page),
    keepPreviousData: true
  });

  const athletes: Athlete[] = data || [];

  const handleScroll = useCallback(() => {
    const element = containerRef.current;
    if (!element) return;

    if (element.scrollTop + element.clientHeight >= element.scrollHeight - 20 && !isFetchingNextPage) {
      setPage((prev) => prev + 1);
    }
  }, [isFetchingNextPage]);

  return (
    <div className="flex flex-col gap-2">
      <input
        className="border p-2"
        placeholder="Search athlete..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(1);
        }}
      />

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="border rounded max-h-60 overflow-auto"
      >
        {athletes.map((athlete) => (
          <div
            key={athlete.id}
            onClick={() => onSelect(athlete)}
            className="p-2 cursor-pointer hover:bg-gray-100"
          >
            {athlete.first_name} {athlete.last_name} ({athlete.country})
          </div>
        ))}

        {(isFetching || isFetchingNextPage) && <Spinner />}
      </div>

      {selected && (
        <div className="text-sm text-gray-600">
          Selected: {selected.first_name} {selected.last_name} ({selected.country})
        </div>
      )}
    </div>
  );
}
