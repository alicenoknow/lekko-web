'use client';

import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import Spinner from '@/components/Spinner';
import { txt } from '@/nls/texts';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import Pagination from '@/components/buttons/Pagination';
import ActionButton from '@/components/buttons/ActionButton';
import FormField from '@/components/forms/FormField';
import { toLocalDatetimeInputFormat } from '@/lib/dateUtils';
import QuestionTypeSelector, {
    QuestionType,
} from '@/components/questions/admin/QuestionTypeSelector';
import QuestionModal from '@/components/questions/admin/QuestionModal';
import QuestionRenderer from '@/components/questions/QuestionRenderer';
import {
    createQuestion,
    deleteQuestion,
    fetchQuestionsFromEvent,
    updateQuestion,
} from '@/app/api/questions';
import { fetchEventById, updateEvent } from '@/app/api/events';
import { Question } from '@/types/questions';

export default function EventDetailPage() {
    const { eventId: eventIdParam } = useParams<{ eventId: string }>();
    const eventId = parseInt(eventIdParam, 10);
    const { token } = usePrivateUserContext();
    const [page, setPage] = useState(1);
    const [isOpenModal, setOpenModal] = useState(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedType, setSelectedType] = useState<QuestionType>('athlete');
    const [currentQuestion, setCurrentQuestion] = useState<Question>({
        id: Date.now() * -1,
        type: selectedType,
        content: '',
        points: 0,
    });
    const [isEventModified, setEventModified] = useState(false);
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

    const { mutate: updateEventQuery, isPending: isUpdatingEvent } =
        useMutation({
            mutationFn: () => {
                const deadline = new Date(form.deadline).toISOString();
                return updateEvent(
                    eventId,
                    token,
                    form.name,
                    form.description,
                    deadline
                );
            },
            onSuccess: () => setEventModified(false),
        });

    const { mutate: addQuestionQuery, isPending: isUpdatingNewQuestion } =
        useMutation({
            mutationFn: ({
                type,
                content,
                points,
            }: {
                type: string;
                content: string;
                points: number;
            }) => {
                return createQuestion(token, eventId, type, content, points);
            },
            onSuccess: (data: Question) => {
                setQuestions((prev) => [...prev, data]);
            },
        });

    const { mutate: modifyQuestionQuery, isPending: isUpdatingQuestion } =
        useMutation({
            mutationFn: ({
                id,
                type,
                content,
                points,
                event_id,
                correct_answer,
            }: {
                id: number;
                type: string;
                content: string;
                points: number;
                event_id: number;
                correct_answer?: any;
            }) => {
                return updateQuestion(
                    token,
                    id,
                    event_id,
                    type,
                    content,
                    points,
                    correct_answer
                );
            },
            onSuccess: (data: Question) => {
                setQuestions((prev) =>
                    prev.map((q) => (q.id === data.id ? data : q))
                );
            },
        });

    const { mutate: deleteQuestionQuery, isPending: isDeletingQuestion } =
        useMutation({
            mutationFn: ({ id }: { id: number }) => {
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
    }, [questionsData]);

    const isPastDeadline = (deadline: string) =>
        new Date(deadline) < new Date();

    const onNewQuestion = useCallback(() => {
        setCurrentQuestion({
            id: Date.now() * -1,
            type: selectedType,
            content: '',
            points: 0,
        });
        setOpenModal(true);
    }, [selectedType, setOpenModal]);

    const onQuestionSubmit = useCallback(
        (question: Question) => {
            if (
                !question.content ||
                !question.points ||
                !question.type ||
                !eventData
            )
                return;

            if (question.id < 0) {
                addQuestionQuery({
                    type: question.type,
                    content: question.content,
                    points: question.points,
                });
            } else {
                modifyQuestionQuery({
                    id: question.id,
                    content: question.content,
                    type: question.type,
                    event_id: eventData.id,
                    points: question.points,
                    correct_answer: question.correct_answer,
                });
            }
        },
        [eventData, addQuestionQuery, modifyQuestionQuery]
    );

    const onQuestionDelete = useCallback(
        (id: number) => {
            if (id > 0) {
                deleteQuestionQuery({ id });
            }
            setQuestions((prev) => prev.filter((q) => q.id !== id));
        },
        [deleteQuestionQuery, setQuestions]
    );

    if (isEventError || isQuestionsError || !eventData || !questionsData) {
        return <ErrorMessage errorMessage={txt.events.notFound} />;
    }

    if (isEventLoading || isQuestionsLoading) return <Spinner />;

    return (
        <div className='flex min-h-screen justify-center'>
            <div className='w-full max-w-2xl space-y-6'>
                <p className='pt-8 text-xl font-bold md:text-3xl'>
                    {txt.events.edit}
                </p>
                <FormField
                    label={txt.forms.name}
                    id='event-title'
                    type='text'
                    value={form.name}
                    onChange={(e) => {
                        setForm({ ...form, name: e.target.value });
                        setEventModified(true);
                    }}
                />
                <FormField
                    label={txt.forms.description}
                    id='event-description'
                    type='text'
                    multiline
                    value={form.description}
                    onChange={(e) => {
                        setForm({ ...form, description: e.target.value });
                        setEventModified(true);
                    }}
                />
                <FormField
                    label={txt.forms.deadline}
                    id='event-deadline'
                    type='datetime-local'
                    value={form.deadline}
                    onChange={(e) => {
                        setForm({ ...form, deadline: e.target.value });
                        setEventModified(true);
                    }}
                />
                <ActionButton
                    label={isEventModified ? txt.forms.save : txt.forms.saved}
                    onClick={updateEventQuery}
                    loading={isUpdatingEvent}
                    disabled={!isEventModified}
                />
                <p className='pt-8 text-xl font-bold md:text-3xl'>
                    {txt.events.questions}
                </p>
                {(isDeletingQuestion ||
                    isUpdatingNewQuestion ||
                    isUpdatingQuestion) && <Spinner isInline />}
                <QuestionTypeSelector
                    selected={selectedType}
                    setSelected={setSelectedType}
                    onAdd={onNewQuestion}
                />
                {questions.map((q: Question) => (
                    <QuestionRenderer
                        key={q.id}
                        question={q}
                        answer={{
                            // TODO
                            question_id: q.id,
                            content: null,
                        }}
                        onEdit={() => {
                            setCurrentQuestion(q);
                            setOpenModal(true);
                        }}
                        onSubmit={() => {}}
                        isPastDeadline={isPastDeadline(eventData.deadline)}
                    />
                ))}
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
            <QuestionModal
                isOpen={isOpenModal}
                setOpen={setOpenModal}
                question={currentQuestion}
                onSubmit={onQuestionSubmit}
                onDelete={onQuestionDelete}
            />
        </div>
    );
}
