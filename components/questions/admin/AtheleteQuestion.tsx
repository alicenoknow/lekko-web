'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ActionButton } from '@/components/buttons';
import Spinner from '@/components/Spinner';

type Athlete = {
  id: number;
  first_name: string | null;
  last_name: string | null;
  country: string | null;
};

interface AthleteQuestionProps {
  questionId: number;
  onSubmit: (answer: { athlete_id: number }) => void;
}

export default function AthleteQuestion({ questionId, onSubmit }: AthleteQuestionProps) {
  const [search, setSearch] = useState('');
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [selected, setSelected] = useState<Athlete | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!search) {
      setAthletes([]);
      return;
    }

    const fetchAthletes = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/athlete?search=${search}`);
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
    setSelected(athlete);
    setSearch('');
    setAthletes([]);
  };

  const handleSubmit = useCallback(() => {
    if (!selected) return;
    setIsSubmitting(true);
    onSubmit({ athlete_id: selected.id });
    setIsSubmitting(false);
  }, [selected, onSubmit]);

  return (
    <div className="flex flex-col gap-4">
      {!selected && (
        <input
          className="border p-2"
          placeholder="Search athlete..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}

      {loading && <Spinner />}

      {!selected && athletes.length > 0 && (
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

      {selected && (
        <div className="flex justify-between items-center border p-2 rounded">
          <span>
            Selected: {selected.first_name} {selected.last_name} ({selected.country})
          </span>
          <button
            className="text-red-500 text-sm"
            onClick={() => setSelected(null)}
          >
            Change
          </button>
        </div>
      )}

      <ActionButton
        label="Submit"
        disabled={!selected}
        onClick={handleSubmit}
        loading={isSubmitting}
      />
    </div>
  );
}
