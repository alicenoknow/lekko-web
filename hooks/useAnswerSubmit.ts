import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createAnswer, updateAnswer } from '@/app/api/answers';
import { Answer } from '@/types/answers';

export function useAnswerSubmit(token: string, userId: number) {
    const create = useMutation({
        mutationFn: ({ questionId, content }: { questionId: number; content: any }) =>
            createAnswer(token, questionId, userId, content),
    });

    const update = useMutation({
        mutationFn: ({ id, questionId, content }: { id: number; questionId: number; content: any }) =>
            updateAnswer(token, id, questionId, userId, content),
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
