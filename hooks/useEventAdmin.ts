import { useMutation } from '@tanstack/react-query';
import {
    createQuestion,
    deleteQuestion,
    updateQuestion,
} from '@/app/api/questions';
import { updateEvent } from '@/app/api/events';
import { Question } from '@/types/questions';
import { queryClient } from '@/context/QueryProvider';

export function useEventAdmin(token: string, eventId: number) {
    const updateEventQuery = useMutation({
        mutationFn: (form: { name: string; description: string; deadline: string }) => {
            const deadline = new Date(form.deadline).toISOString();
            return updateEvent(eventId, token, form.name, form.description, deadline);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['event', eventId] });
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
    });

    const deleteQuestionQuery = useMutation({
        mutationFn: (id: number) => deleteQuestion(token, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['questions', eventId] });
        },
    });

    return {
        updateEventQuery,
        addQuestionQuery,
        modifyQuestionQuery,
        deleteQuestionQuery,
    };
}
