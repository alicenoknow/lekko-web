'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import Spinner from '@/components/Spinner';
import { txt } from '@/nls/texts';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import ActionIcon from '@/components/buttons/ActionIcon';
import QuestionsSideNav from '@/components/questions/QuestionsSideNav';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import QuestionTypeSelector from '@/components/questions/admin/QuestionTypeSelector';
import QuestionModal from '@/components/questions/admin/QuestionModal';
import QuestionRenderer from '@/components/questions/QuestionRenderer';
import { Question, QuestionType } from '@/types/questions';
import { useEventDetails } from '@/hooks/useEventDetails';
import { useEventAdmin } from '@/hooks/useEventAdmin';
import { useQuestionNavigation } from '@/hooks/useQuestionNavigation';
import { useConfirmationDialog } from '@/hooks/useConfirmationDialog';
import ConfirmationDialog from '@/components/forms/ConfirmationDialog';
import EventDetailsForm from '@/components/event/EventDetailsForm';
import { type EventFormFields } from '@/components/event/EventDetailsForm';
import { toLocalDatetimeInputFormat } from '@/lib/dateUtils';

const TEMP_QUESTION_ID = -1;

export default function EventDetailAdminPage() {
    const { eventId: eventIdParam } = useParams<{ eventId: string }>();
    const eventId = parseInt(eventIdParam, 10);
    const validEventId = isNaN(eventId) ? 0 : eventId;
    const { token } = useAuthenticatedUser();

    const [isEventModified, setEventModified] = useState(false);
    const [form, setForm] = useState({ name: '', description: '', deadline: '' });
    const [isOpenModal, setOpenModal] = useState(false);
    const [selectedType, setSelectedType] = useState<QuestionType>('athlete');
    const [currentQuestion, setCurrentQuestion] = useState<Question>({
        id: TEMP_QUESTION_ID,
        type: 'athlete',
        content: '',
        points: 0,
    });

    const formInitialized = useRef(false);

    const { eventQuery, questionsQuery, answersQuery, isPastDeadline } =
        useEventDetails(token, validEventId);

    const questions = questionsQuery.data?.data ?? [];

    const {
        currentQuestionId: selectedQuestionId,
        setCurrentQuestionId: setSelectedQuestionId,
        currentIndex: selectedIndex,
        currentQuestion: selectedNavQuestion,
        handlePrev: handlePrevQuestion,
        handleNext: handleNextQuestion,
    } = useQuestionNavigation(questions);

    const handleAddSuccess = useCallback(
        (question: Question) => {
            setSelectedQuestionId(question.id);
        },
        [setSelectedQuestionId]
    );

    const {
        updateEventQuery,
        addQuestionQuery,
        modifyQuestionQuery,
        deleteQuestionQuery,
    } = useEventAdmin(
        token,
        validEventId,
        setEventModified,
        handleAddSuccess,
        () => setOpenModal(false)
    );

    const deleteConfirm = useConfirmationDialog<number>(
        (id) => deleteQuestionQuery.mutate(id)
    );

    useEffect(() => {
        if (eventQuery.data && !formInitialized.current) {
            setForm({
                name: eventQuery.data.name || '',
                description: eventQuery.data.description || '',
                deadline: toLocalDatetimeInputFormat(eventQuery.data.deadline),
            });
            formInitialized.current = true;
        }
    }, [eventQuery.data]);

    const onNewQuestion = () => {
        setCurrentQuestion({
            id: TEMP_QUESTION_ID,
            type: selectedType,
            content: '',
            points: 0,
        });
        setOpenModal(true);
    };

    const onQuestionSubmit = (question: Question) => {
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
    };

    if (eventQuery.isLoading || questionsQuery.isLoading) {
        return <Spinner />;
    }

    if (!validEventId || eventQuery.isError || questionsQuery.isError || !eventQuery.data) {
        return <ErrorMessage errorMessage={txt.events.notFound} />;
    }

    return (
        <>
            <EventDetailsForm
                form={form}
                isModified={isEventModified}
                isSaving={updateEventQuery.isPending}
                onFormChange={(field: EventFormFields, value: string) => {
                    setForm((f) => ({ ...f, [field]: value }));
                    setEventModified(true);
                }}
                onSave={() => updateEventQuery.mutate(form)}
            />
            <h2 className='pt-8 text-xl font-bold md:text-3xl'>
                {txt.events.questions}
            </h2>
            <QuestionTypeSelector
                selected={selectedType}
                setSelected={setSelectedType}
                onAdd={onNewQuestion}
            />
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
                                <ActionIcon
                                    label={<FaArrowLeft className='text-primary-light' />}
                                    onClick={handlePrevQuestion}
                                />
                            )}
                            <span className='px-2'>
                                {selectedIndex + 1} / {questions.length}
                            </span>
                            {selectedIndex < questions.length - 1 && (
                                <ActionIcon
                                    label={<FaArrowRight className='text-primary-light' />}
                                    onClick={handleNextQuestion}
                                />
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
                onDelete={deleteConfirm.openDialog}
            />
            <ConfirmationDialog
                isOpen={deleteConfirm.isOpen}
                title={txt.questions.deleteQuestion}
                description={txt.questions.deleteConfirm}
                onConfirm={deleteConfirm.handleConfirm}
                onCancel={deleteConfirm.handleCancel}
                confirmLabel={txt.forms.confirm}
                cancelLabel={txt.forms.cancel}
            />
        </>
    );
}
