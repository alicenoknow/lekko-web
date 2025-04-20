import { txt } from '@/nls/texts';
import FormField from '../../../forms/FormField';
import { useCallback } from 'react';

interface Props {
    content: string;
    points: number;
    onContentChange: (value: string) => void;
    onPointsChange: (value: number) => void;
}

export default function EditQuestionHeader({
    content,
    points,
    onContentChange,
    onPointsChange,
}: Props) {
    const handleContentChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            onContentChange(e.target.value),
        [onContentChange]
    );

    const handlePointsChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
                onPointsChange(Number(value));
            }
        },
        [onPointsChange]
    );
    return (
        <>
            <FormField
                label={txt.questions.content}
                id='question-content'
                type='text'
                value={content}
                onChange={handleContentChange}
                required
                multiline
            />
            <FormField
                label={txt.questions.points}
                id='question-points'
                type='text'
                value={points}
                onChange={handlePointsChange}
                required
            />
        </>
    );
}
