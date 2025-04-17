import ActionIcon from "@/components/buttons/ActionIcon";
import { useCallback } from "react";
import { FaTimes } from "react-icons/fa";

export default function DeleteQuestion({
    questionId,
    onDelete,
}: {
    questionId: number;
    onDelete: (questionId: number) => void;
}) {
    const deleteQuestion = useCallback(
        () => onDelete(questionId),
        [questionId, onDelete]
    );
    return (
        <ActionIcon label={<FaTimes size={24} />} onClick={deleteQuestion} />
    );
}