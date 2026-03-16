import {
    createQuestion,
    deleteQuestion,
    updateQuestion,
} from '@/lib/api/questions';
import { updateEvent } from '@/lib/api/events';
import { Question } from '@/types/questions';
import { queryClient } from '@/context/QueryProvider';
import { txt } from '@/nls/texts';
import { useMutationWithError } from '@/hooks/useMutationWithError';

export function useEventAdmin(
    token: string,
    eventId: number,
    setEventModified: (isModified: boolean) => void,
    onAddSuccess?: (question: Question) => void,
    onQuestionSubmitSuccess?: () => void
) {
    const updateEventQuery = useMutationWithError({
        mutationFn: (form: {
            name: string;
            description: string;
            deadline: string;
        }) => {
            const deadline = new Date(form.deadline).toISOString();
            return updateEvent(
                eventId,
                token,
                form.name,
                form.description,
                deadline
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['event', eventId] });
            setEventModified(false);
        },
        onError: () => setEventModified(true),
        errorMessage: txt.errors.eventUpdate,
        errorLogMessage: 'Cannot update event.',
    });

    const addQuestionQuery = useMutationWithError({
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
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['questions', eventId] });
            onAddSuccess?.(data);
            onQuestionSubmitSuccess?.();
        },
        errorMessage: txt.errors.questionAdd,
        errorLogMessage: 'Cannot add question.',
    });

    const modifyQuestionQuery = useMutationWithError({
        mutationFn: (question: Question) => {
            return updateQuestion(
                token,
                question.id,
                eventId,
                question.type,
                question.content,
                question.points,
                question.correct_answer
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['questions', eventId] });
            onQuestionSubmitSuccess?.();
        },
        errorMessage: txt.errors.questionUpdate,
        errorLogMessage: 'Cannot update question.',
    });

    const deleteQuestionQuery = useMutationWithError({
        mutationFn: (id: number) => deleteQuestion(token, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['questions', eventId] });
        },
        errorMessage: txt.errors.questionDelete,
        errorLogMessage: 'Cannot remove question.',
    });

    return {
        updateEventQuery,
        addQuestionQuery,
        modifyQuestionQuery,
        deleteQuestionQuery,
    };
}
