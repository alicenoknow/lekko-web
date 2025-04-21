import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createAnswer, updateAnswer } from '@/app/api/answers';
import { Answer, AnswerContent } from '@/types/answers';
import { queryClient } from '@/context/QueryProvider';

export function useAnswerSubmit(token: string, userId: number) {
    const create = useMutation({
        mutationFn: ({ questionId, content }: { questionId: number; content: AnswerContent }) =>
            createAnswer(token, questionId, userId, content),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['answers'] }),
    });

    const update = useMutation({
        mutationFn: ({ id, questionId, content }: { id: number; questionId: number; content: AnswerContent }) =>
            updateAnswer(token, id, questionId, userId, content),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['answers'] }),
    });

    const onSubmit = useCallback(
        (answer: Answer) => {
            if (!answer.content || !answer.question_id) return;

            if (answer.id < 0) {
                create.mutate({ questionId: answer.question_id, content: answer.content });
            } else {
                update.mutate({ id: answer.id, questionId: answer.question_id, content: answer.content });
            }
        },
        [create, update]
    );

    return {
        onSubmit,
        isLoading: create.isPending || update.isPending,
    };
}
