'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import Spinner from '@/components/Spinner';
import { txt } from '@/nls/texts';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import Pagination from '@/components/buttons/Pagination';
import ActionButton from '@/components/buttons/ActionButton';
import FormField from '@/components/forms/FormField';
import QuestionTypeSelector from '@/components/questions/admin/QuestionTypeSelector';
import QuestionModal from '@/components/questions/admin/QuestionModal';
import QuestionRenderer from '@/components/questions/QuestionRenderer';
import { Question, QuestionType } from '@/types/questions';
import { toLocalDatetimeInputFormat } from '@/lib/dateUtils';
import { useEventDetails } from '@/hooks/useEventDetails';
import { useEventAdmin } from '@/hooks/useEventAdmin';
import { useAnswerSubmit } from '@/hooks/useAnswerSubmit';

export default function EventDetailAdminPage() {
    const { eventId: eventIdParam } = useParams<{ eventId: string }>();
    const eventId = parseInt(eventIdParam, 10);
    const { token, user } = usePrivateUserContext();
    const [page, setPage] = useState(1);

    const { eventQuery, questionsQuery, answersQuery, isPastDeadline } =
        useEventDetails(token, eventId, page);

    const {
        updateEventQuery,
        addQuestionQuery,
        modifyQuestionQuery,
        deleteQuestionQuery,
    } = useEventAdmin(token, eventId);

    const { onSubmit: onAnswerSubmit } = useAnswerSubmit(token, user.sub);

    const [form, setForm] = useState({
        name: '',
        description: '',
        deadline: '',
    });
    const [isEventModified, setEventModified] = useState(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isOpenModal, setOpenModal] = useState(false);
    const [selectedType, setSelectedType] = useState<QuestionType>('athlete');
    const [currentQuestion, setCurrentQuestion] = useState<Question>({
        id: Date.now() * -1,
        type: selectedType,
        content: '',
        points: 0,
    });

    useEffect(() => {
        if (eventQuery.data) {
            setForm({
                name: eventQuery.data.name || '',
                description: eventQuery.data.description || '',
                deadline: toLocalDatetimeInputFormat(eventQuery.data.deadline),
            });
        }
    }, [eventQuery.data]);

    useEffect(() => {
        if (questionsQuery.data?.data) {
            setQuestions(questionsQuery.data.data);
        }
    }, [questionsQuery.data]);

    const onNewQuestion = useCallback(() => {
        setCurrentQuestion({
            id: Date.now() * -1,
            type: selectedType,
            content: '',
            points: 0,
        });
        setOpenModal(true);
    }, [selectedType]);

    const onQuestionSubmit = useCallback(
        (question: Question) => {
            if (!question.content || !question.points || !question.type) return;

            if (question.id < 0) {
                addQuestionQuery.mutate({
                    type: question.type,
                    content: question.content,
                    points: question.points,
                });
            } else {
                modifyQuestionQuery.mutate(question);
            }
        },
        [addQuestionQuery, modifyQuestionQuery]
    );

    const onQuestionDelete = useCallback(
        (id: number) => {
            if (id > 0) {
                deleteQuestionQuery.mutate(id);
            }
            setQuestions((prev) => prev.filter((q) => q.id !== id));
        },
        [deleteQuestionQuery]
    );

    if (
        eventQuery.isLoading ||
        questionsQuery.isLoading ||
        answersQuery.isLoading
    ) {
        return <Spinner />;
    }

    if (
        eventQuery.isError ||
        questionsQuery.isError ||
        answersQuery.isError ||
        !eventQuery.data
    ) {
        return <ErrorMessage errorMessage={txt.events.notFound} />;
    }

    return (
        <>
            <h1 className='mt-6 text-xl font-bold md:text-3xl'>
                {txt.events.edit}
            </h1>
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
                onClick={() => updateEventQuery.mutate(form)}
                loading={updateEventQuery.isPending}
                disabled={!isEventModified}
            />
            <h2 className='pt-8 text-xl font-bold md:text-3xl'>
                {txt.events.questions}
            </h2>
            <QuestionTypeSelector
                selected={selectedType}
                setSelected={setSelectedType}
                onAdd={onNewQuestion}
            />
            {questions.map((q: Question) => (
                <QuestionRenderer
                    key={q.id}
                    question={q}
                    answer={answersQuery.data?.data.find(
                        (a) => a.question_id === q.id
                    )}
                    onEdit={() => {
                        setCurrentQuestion(q);
                        setOpenModal(true);
                    }}
                    onSubmit={onAnswerSubmit}
                    isPastDeadline={isPastDeadline}
                />
            ))}
            {questionsQuery.data?.pagination_info && (
                <Pagination
                    pagination={questionsQuery.data.pagination_info}
                    changePage={setPage}
                />
            )}
            <QuestionModal
                isOpen={isOpenModal}
                setOpen={setOpenModal}
                question={currentQuestion}
                onSubmit={onQuestionSubmit}
                onDelete={onQuestionDelete}
            />
        </>
    );
}
