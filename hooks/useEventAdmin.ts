import { useMutation } from '@tanstack/react-query';
import {
    createQuestion,
    deleteQuestion,
    updateQuestion,
} from '@/app/api/questions';
import { updateEvent } from '@/app/api/events';
import { Question } from '@/types/questions';
import { queryClient } from '@/context/QueryProvider';
import { useErrorStore } from '@/store/error';
import { txt } from '@/nls/texts';

export function useEventAdmin(token: string, eventId: number, setEventModified: (isModified: boolean) => void) {
    const { showErrorDialog } = useErrorStore();

    const updateEventQuery = useMutation({
        mutationFn: (form: { name: string; description: string; deadline: string }) => {
            const deadline = new Date(form.deadline).toISOString();
            return updateEvent(eventId, token, form.name, form.description, deadline);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['event', eventId] });
            setEventModified(false);
        },
        onError: () => {
            console.error("Cannot update event.")
            showErrorDialog(txt.errors.eventUpdate);
            setEventModified(true);
        },
    });

    const addQuestionQuery = useMutation({
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['questions', eventId] });
        },
        onError: () => {
            console.error("Cannot add question.")
            showErrorDialog(txt.errors.questionAdd);
        },
    });

    const modifyQuestionQuery = useMutation({
        mutationFn: (question: Question) => {
            return updateQuestion(
                token,
                question.id,
                question.event_id!,
                question.type,
                question.content,
                question.points,
                question.correct_answer
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['questions', eventId] });
        },
        onError: () => {
            console.error("Cannot update question.")
            showErrorDialog(txt.errors.questionUpdate);
        },
    });

    const deleteQuestionQuery = useMutation({
        mutationFn: (id: number) => deleteQuestion(token, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['questions', eventId] });
        },
        onError: () => {
            console.error("Cannot remove question.")
            showErrorDialog(txt.errors.questionDelete);
        },
    });

    return {
        updateEventQuery,
        addQuestionQuery,
        modifyQuestionQuery,
        deleteQuestionQuery,
    };
}
