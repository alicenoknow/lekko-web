import { isAdmin } from '@/lib/admin';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { Question } from '@/types/questions';

export function useQuestionState(question: Question, isPastDeadline: boolean) {
    const { user } = useAuthenticatedUser();
    const admin = isAdmin(user);
    const isResolved = !!question.correct_answer;
    const isLocked = isPastDeadline || isResolved;

    return {
        admin,
        isResolved,
        isLocked,
        // For simple single-answer questions (athlete, country, numeric)
        showCorrectAnswer: admin || isLocked,
        // For ranking questions — only show when correct answer actually exists
        showCorrectAnswers: admin || (isLocked && isResolved),
    };
}
