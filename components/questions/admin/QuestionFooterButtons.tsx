import { Question } from '@/app/api/typer';
import { ActionButton } from '@/components/buttons';
import { txt } from '@/nls/texts';

interface Props {
    isLoading: boolean;
    disableSubmit: boolean;
    onSubmit: () => void;
    onDelete: () => void;
}

export default function QuestionFooterButtons({
    isLoading,
    disableSubmit,
    onSubmit,
    onDelete,
}: Props) {
    return (
        <div className='justify-between py-4 sm:flex sm:flex-row-reverse'>
            <ActionButton
                disabled={disableSubmit}
                loading={isLoading}
                label={txt.questions.confirm}
                onClick={onSubmit}
            />
            <ActionButton
                loading={isLoading}
                label={txt.questions.delete}
                onClick={onDelete}
            />
        </div>
    );
}
