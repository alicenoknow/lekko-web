'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ActionButton } from '@/components/buttons';
import Spinner from '@/components/Spinner';

type Athlete = {
  id: number;
  first_name: string | null;
  last_name: string | null;
  country: string | null;
};

interface Props {
  questionId: number;
  onSubmit: (answer: {
    athlete_id_one: number;
    athlete_id_two: number;
    athlete_id_three: number;
  }) => void;
}

export default function AthleteRankingQuestion({ questionId, onSubmit }: Props) {
  const [search, setSearch] = useState('');
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [selected, setSelected] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = selected.length === 3;

  useEffect(() => {
    if (!search) {
      setAthletes([]);
      return;
    }

    const fetchAthletes = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/athlete?search=${search}`
        );
        setAthletes(res.data);
      } catch (err) {
        console.error('Failed to fetch athletes', err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchAthletes, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  const handleSelect = (athlete: Athlete) => {
    if (selected.find((a) => a.id === athlete.id)) return;
    if (selected.length >= 3) return;
    setSelected((prev) => [...prev, athlete]);
    setSearch('');
    setAthletes([]);
  };

  const handleRemove = (id: number) => {
    setSelected((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    onSubmit({
      athlete_id_one: selected[0].id,
      athlete_id_two: selected[1].id,
      athlete_id_three: selected[2].id,
    });
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {selected.length < 3 && (
        <input
          className="border p-2"
          placeholder="Search athlete..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}

      {loading && <Spinner />}

      {athletes.length > 0 && selected.length < 3 && (
        <ul className="border rounded">
          {athletes.map((athlete) => (
            <li
              key={athlete.id}
              className="cursor-pointer hover:bg-gray-100 p-2"
              onClick={() => handleSelect(athlete)}
            >
              {athlete.first_name} {athlete.last_name} ({athlete.country})
            </li>
          ))}
        </ul>
      )}

      {selected.length > 0 && (
        <div className="space-y-2">
          {selected.map((athlete, idx) => (
            <div
              key={athlete.id}
              className="flex justify-between items-center border p-2 rounded"
            >
              <span>
                {idx + 1}. {athlete.first_name} {athlete.last_name} ({athlete.country})
              </span>
              <button
                className="text-red-500 text-sm"
                onClick={() => handleRemove(athlete.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <ActionButton
        label="Submit Ranking"
        disabled={!canSubmit}
        onClick={handleSubmit}
        loading={isSubmitting}
      />
    </div>
  );
}
