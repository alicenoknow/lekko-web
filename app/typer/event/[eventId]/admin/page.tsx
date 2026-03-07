'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import Spinner from '@/components/Spinner';
import { txt } from '@/nls/texts';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import ActionButton from '@/components/buttons/ActionButton';
import ActionIcon from '@/components/buttons/ActionIcon';
import QuestionsSideNav from '@/components/questions/QuestionsSideNav';
import { FaArrowLeft, FaArrowRight, FaChevronDown } from 'react-icons/fa';
import FormField from '@/components/forms/FormField';
import QuestionTypeSelector from '@/components/questions/admin/QuestionTypeSelector';
import QuestionModal from '@/components/questions/admin/QuestionModal';
import QuestionRenderer from '@/components/questions/QuestionRenderer';
import { Question, QuestionType } from '@/types/questions';
import { toLocalDatetimeInputFormat } from '@/lib/dateUtils';
import { useEventDetails } from '@/hooks/useEventDetails';
import { useEventAdmin } from '@/hooks/useEventAdmin';
// import { useAnswerSubmit } from '@/hooks/useAnswerSubmit'; // Currently unused
import ConfirmationDialog from '@/components/forms/ConfirmationDialog';

export default function EventDetailAdminPage() {
    const { eventId: eventIdParam } = useParams<{ eventId: string }>();
    const eventId = parseInt(eventIdParam, 10);
    const { token } = useAuthenticatedUser();
    const [isConfirmationOpen, setConfirmationOpen] = useState(false);
    const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
    const [isDetailsOpen, setDetailsOpen] = useState(true);
    const [questionToDelete, setQuestionToDelete] = useState<number | null>(
        null
    );
    const [isEventModified, setEventModified] = useState(false);

    const { eventQuery, questionsQuery, answersQuery, isPastDeadline } =
        useEventDetails(token, eventId, 1);

    const handleAddSuccess = useCallback((question: Question) => {
        setQuestions((prev) => {
            if (prev.some((q) => q.id === question.id)) return prev;
            return [...prev, question];
        });
        setSelectedQuestionId(question.id);
    }, []);

    const {
        updateEventQuery,
        addQuestionQuery,
        modifyQuestionQuery,
        deleteQuestionQuery,
    } = useEventAdmin(token, eventId, setEventModified, handleAddSuccess);

    const [form, setForm] = useState({
        name: '',
        description: '',
        deadline: '',
    });
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

    useEffect(() => {
        if (questions.length > 0 && selectedQuestionId === null) {
            setSelectedQuestionId(questions[0]?.id ?? null);
        }
    }, [questions, selectedQuestionId]);

    const selectedIndex = questions.findIndex((q) => q.id === selectedQuestionId);
    const selectedNavQuestion = questions[selectedIndex] ?? null;

    const handlePrevQuestion = useCallback(() => {
        const prev = questions[selectedIndex - 1];
        if (selectedIndex > 0 && prev) setSelectedQuestionId(prev.id);
    }, [selectedIndex, questions]);

    const handleNextQuestion = useCallback(() => {
        const next = questions[selectedIndex + 1];
        if (selectedIndex < questions.length - 1 && next) setSelectedQuestionId(next.id);
    }, [selectedIndex, questions]);

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

    const handleDeleteRequest = useCallback((id: number) => {
        setQuestionToDelete(id);
        setConfirmationOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(() => {
        if (questionToDelete !== null) {
            onQuestionDelete(questionToDelete);
        }
        setConfirmationOpen(false);
        setQuestionToDelete(null);
    }, [questionToDelete, onQuestionDelete]);

    const handleCancelDelete = useCallback(() => {
        setConfirmationOpen(false);
        setQuestionToDelete(null);
    }, []);

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
            <button
                onClick={() => setDetailsOpen((v) => !v)}
                className='mt-6 flex w-full items-center justify-between text-left'
            >
                <h1 className='text-xl font-bold md:text-3xl'>
                    {txt.events.edit}
                </h1>
                <FaChevronDown
                    className={`text-primary-dark transition-transform duration-300 ${
                        isDetailsOpen ? 'rotate-180' : ''
                    }`}
                    size={20}
                />
            </button>
            {isDetailsOpen && (
                <div className='flex flex-col gap-2'>
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
                        className='w-auto'
                    />
                </div>
            )}
            <h2 className='pt-8 text-xl font-bold md:text-3xl'>
                {txt.events.questions}
            </h2>
            {!isPastDeadline && (
                <QuestionTypeSelector
                    selected={selectedType}
                    setSelected={setSelectedType}
                    onAdd={onNewQuestion}
                />
            )}
            {questions.length === 0 ? (
                <p>{txt.events.noQuestions}</p>
            ) : (
                <>
                    <QuestionsSideNav
                        questions={questions}
                        answers={answersQuery.data?.data ?? []}
                        currentQuestionId={selectedQuestionId}
                        onNavigate={setSelectedQuestionId}
                        adminMode
                    />
                    <div className='relative mb-3 flex h-12 items-center justify-center'>
                        <div className='absolute right-0 flex items-center gap-4'>
                            {selectedIndex > 0 && (
                                <ActionIcon label={<FaArrowLeft className='text-primary-light' />} onClick={handlePrevQuestion} />
                            )}
                            <span className='px-2'>
                                {selectedIndex + 1} / {questions.length}
                            </span>
                            {selectedIndex < questions.length - 1 && (
                                <ActionIcon label={<FaArrowRight className='text-primary-light' />} onClick={handleNextQuestion} />
                            )}
                        </div>
                    </div>
                    {selectedNavQuestion && (
                        <QuestionRenderer
                            key={selectedNavQuestion.id}
                            question={selectedNavQuestion}
                            answer={answersQuery.data?.data.find(
                                (a) => a.question_id === selectedNavQuestion.id
                            )}
                            onEdit={() => {
                                setCurrentQuestion(selectedNavQuestion);
                                setOpenModal(true);
                            }}
                            isPastDeadline={isPastDeadline}
                        />
                    )}
                </>
            )}
            <QuestionModal
                isOpen={isOpenModal}
                setOpen={setOpenModal}
                question={currentQuestion}
                onSubmit={onQuestionSubmit}
                onDelete={handleDeleteRequest}
            />
            <ConfirmationDialog
                isOpen={isConfirmationOpen}
                title={txt.questions.deleteQuestion}
                description={txt.questions.deleteConfirm}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmLabel={txt.forms.confirm}
                cancelLabel={txt.forms.cancel}
            />
        </>
    );
}
