'use client';

import { useState } from 'react';
import { ActionButton } from '@/components/buttons';

interface Props {
  questionId: number;
  onSubmit: (answer: { country: string }) => void;
}

export default function CountryQuestion({ questionId, onSubmit }: Props) {
  const [country, setCountry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!country.trim()) return;
    setIsSubmitting(true);
    onSubmit({ country: country.trim() });
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        className="border p-2"
        placeholder="Enter country..."
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />
      <ActionButton
        label="Submit"
        onClick={handleSubmit}
        loading={isSubmitting}
        disabled={!country.trim()}
      />
    </div>
  );
}
