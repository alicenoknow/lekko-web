import { txt } from '@/nls/texts';
import FormField from '../forms/FormField';

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
    return (
        <>
            <FormField
                label={txt.questions.content}
                id='question-content'
                type='text'
                value={content}
                onChange={(e) => onContentChange(e.target.value)}
                required
                multiline
            />
            <FormField
                label={txt.questions.points}
                id='question-points'
                type='number'
                value={points}
                onChange={(e) => onPointsChange(Number(e.target.value))}
                required
            />
        </>
    );
}
