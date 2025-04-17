'use client';

import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import {
    fetchEventById,
    fetchQuestionsFromEvent,
    updateEvent,
    Question,
    createQuestion,
    updateQuestion,
    deleteQuestion,
} from '@/app/api/typer';
import Spinner from '@/components/Spinner';
import { txt } from '@/nls/texts';
import QuestionRenderer from '@/components/questions/admin/AdminQuestionRenderer';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import Pagination from '@/components/typer/Pagination';
import { ActionButton } from '@/components/buttons';
import FormField from '@/components/forms/FormField';
import { toLocalDatetimeInputFormat } from '@/lib/DateUtils';
import QuestionTypeSelector, { QuestionType } from '@/components/questions/admin/QuestionTypeSelector';

export default function EventDetailPage() {
    const { eventId } = useParams<{ eventId: string }>();
    const { token } = usePrivateUserContext();
    const [page, setPage] = useState(1);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [eventChanged, setEventChanged] = useState(false);
    const [form, setForm] = useState({
        name: '',
        description: '',
        deadline: '',
    });

    const {
        data: eventData,
        isLoading: isEventLoading,
        isError: isEventError,
    } = useQuery({
        queryKey: ['event', eventId],
        queryFn: () => fetchEventById(token, eventId),
        enabled: !!token && !!eventId,
    });

    const {
        data: questionsData,
        isLoading: isQuestionsLoading,
        isError: isQuestionsError,
    } = useQuery({
        queryKey: ['questions', eventId, page],
        queryFn: () => fetchQuestionsFromEvent(token, eventId, page),
        enabled: !!token && !!eventId,
    });

    const { mutate: updateEventQuery, isPending: isUpdatingEvent } = useMutation({
        mutationFn: () => {
            const deadline = new Date(form.deadline).toISOString();
            return updateEvent(
                eventId,
                token,
                form.name,
                form.description,
                deadline
            )
        },
        onSuccess: () => setEventChanged(false)
    });

    const { mutate: addQuestionQuery, isPending: isUpdatingNewQuestion } = useMutation({
        mutationFn: ({
            type,
            content,
            points,
            correct_answer,
        }: {
            type: string;
            content: string;
            points: number;
            correct_answer?: any;
        }) => {
            return createQuestion(
                token,
                eventId,
                type,
                content,
                points,
                correct_answer
            );
        },
    });

    const { mutate: modifyQuestionQuery, isPending: isUpdatingQuestion } = useMutation({
        mutationFn: ({
            id,
            content,
            points,
            correct_answer,
        }: {
            id: number;
            content: string;
            points: number;
            correct_answer?: any;
        }) => {
            return updateQuestion(token, id, content, points, correct_answer);
        },
    });

    const { mutate: deleteQuestionQuery, isPending: isDeletingQuestion } = useMutation({
        mutationFn: ({ id }: { id: number; }) => {
            return deleteQuestion(token, id);
        },
    });


    useEffect(() => {
        if (eventData) {
            setForm({
                name: eventData.name || '',
                description: eventData.description || '',
                deadline: toLocalDatetimeInputFormat(eventData.deadline) || '',
            });
        }
    }, [eventData]);


    useEffect(() => {
        if (questionsData?.data) {
            setQuestions(questionsData.data);
        }
    }, [questionsData])

    const onQuestionAdd = useCallback((type: QuestionType) => {
        setQuestions(prev => [
            ...prev,
            {
                id: Date.now() * -1,
                content: "",
                type,
                points: 0,
            },
        ]);
    }, []);

    const onQuestionSubmit = useCallback((question: Question) => {
        if (!question.content || !question.points || !question.type) return;

        if (question.id < 0) {
            addQuestionQuery({
                type: question.type,
                content: question.content,
                points: question.points,
                correct_answer: question.correct_answer,
            });
        } else {
            modifyQuestionQuery({
                id: question.id,
                content: question.content,
                points: question.points,
                correct_answer: question.correct_answer,
            });
        }
    }, [addQuestionQuery, modifyQuestionQuery]);

    const onQuestionDelete = useCallback((id: number) => {
        // TODO local just from array
        if (id < 0) {
            return
        } else {
            deleteQuestionQuery({ id });
        }
    }, [])

    if (isEventLoading || isQuestionsLoading) return <Spinner />;

    if (isEventError || isQuestionsError || !eventData || !questionsData) {
        return <ErrorMessage errorMessage={txt.events.notFound} />;
    }

    return (
        <div className="min-h-screen flex justify-center p-12">
            <div className='space-y-6'>
                <p className="text-3xl font-bold">{txt.events.edit}</p>
                <div className='space-y-4 max-w-xl'>
                    <p></p>
                    <FormField
                        label={txt.forms.name}
                        id='event-title'
                        type='text'
                        value={form.name}
                        onChange={(e) => {
                            setForm({ ...form, name: e.target.value });
                            setEventChanged(true);
                        }}
                    />
                    <FormField
                        label={txt.forms.description}
                        id='event-description'
                        type='text'
                        value={form.description}
                        onChange={(e) => {
                            setForm({ ...form, description: e.target.value })
                            setEventChanged(true);
                        }}
                    />
                    <FormField
                        label={txt.forms.deadline}
                        id='event-deadline'
                        type='datetime-local'
                        value={form.deadline}
                        onChange={(e) => {
                            setForm({ ...form, deadline: e.target.value })
                            setEventChanged(true);
                        }}
                    />
                    <ActionButton
                        label={txt.events.save}
                        onClick={updateEventQuery}
                        loading={isUpdatingEvent}
                        disabled={!eventChanged}
                    />
                </div>
                <p className="text-3xl pt-10 font-bold">{txt.events.questions}</p>
                {questions.map((q: Question) => (
                    <QuestionRenderer
                        key={q.id}
                        question={q}
                        onSubmit={onQuestionSubmit}
                        onDelete={onQuestionDelete}
                    />
                ))}
                <QuestionTypeSelector onAdd={onQuestionAdd} />
                {questionsData?.pagination_info && (
                    <Pagination
                        pagination={questionsData.pagination_info}
                        changePage={(newPage) => {
                            setPage(newPage);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    />
                )}
            </div>
        </div>
    );
}
