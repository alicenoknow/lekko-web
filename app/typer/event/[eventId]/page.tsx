'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useUserStore } from '@/store/user';
import { EventDetail, getEventById, getQuestionsFromEvent, Question, Questions } from '@/app/api/typer';
import { isSuccess } from '@/app/api/common';
import { useRouter } from 'next/navigation';
import { AdminOnly } from '@/components/auth/AdminOnly';
import { PrivateContent } from '@/components/auth/PrivateContent';
import ActionIcon from '@/components/buttons/ActionIcon';
import Spinner from '@/components/Spinner';
import { txt } from '@/nls/texts';
import { FaEdit } from 'react-icons/fa';
import QuestionRenderer from '@/components/questions/QuestionRenderer';


export default function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { token } = useUserStore();
  const router = useRouter();

  const [eventData, setEventData] = useState<EventDetail | null>(null);
  const [questionsData, setQuestionsData] = useState<Question[] | null>(null);
  const [answersData, setAnswersData] = useState<[] | null>(null); // TODO
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!token) return;
      try {
        const response = await getEventById(token, eventId);
        if (isSuccess<EventDetail>(response)) {
          setEventData(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch event:', err);
      } finally {
        setLoading(false);
      }
    };
    const fetchQuestions = async () => {
      if (!token) return;
      try {
        const response = await getQuestionsFromEvent(token, eventId);
        if (isSuccess<Questions>(response)) {
          setQuestionsData(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch event:', err);
      } finally {
        setLoading(false);
      }
    };
    const fetchAnswers = async () => {
      if (!token) return;
      try {
        const response = await getQuestionsFromEvent(token, eventId);
        if (isSuccess<Questions>(response)) {
          setQuestionsData(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch event:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
    fetchQuestions();
    fetchAnswers();
  }, [eventId]);

  const isFormEmpty = useCallback((questions: Question[] | null): questions is null | [] => !questions || questions.length === 0, []);

  const handleOpenAdminPanel = () => {
    router.push(`/typer/event/${eventId}/admin`);
  }

  const submitAnswer = useCallback(() => {

  }, [])

  if (loading) return <Spinner />;

  if (!eventData) return <p className="p-6">{txt.events.notFound}</p>;

  return (
    <PrivateContent redirect>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">{eventData.name}</h1>
        {eventData.description && <p>{eventData.description}</p>}
        <p className="text-sm text-gray-600">
          {txt.events.deadline}: {new Date(eventData.deadline).toLocaleString()}
        </p>
        <AdminOnly>
          <ActionIcon label={<FaEdit size={24} />} onClick={handleOpenAdminPanel} />
        </AdminOnly>
        {isFormEmpty(questionsData)
          ? <p>{txt.events.noQuestions}</p>
          : questionsData.map((q) => <QuestionRenderer key={q.id} question={q} onSubmit={submitAnswer} />)}
      </div>
    </PrivateContent>
  );
}
