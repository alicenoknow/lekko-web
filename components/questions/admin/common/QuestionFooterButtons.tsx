import ActionButton from '@/components/buttons/ActionButton';
import { txt } from '@/nls/texts';

interface Props {
    isLoading: boolean;
    disableSubmit: boolean;
    isNew?: boolean;
    onSubmit: () => void;
    onDelete: () => void;
}

export default function QuestionFooterButtons({
    isLoading,
    disableSubmit,
    isNew = false,
    onSubmit,
    onDelete,
}: Props) {
    return (
        <div className='flex flex-wrap justify-between gap-4 py-4'>
            <ActionButton
                disabled={disableSubmit}
                loading={isLoading}
                label={txt.questions.confirm}
                onClick={onSubmit}
            />
            <ActionButton
                loading={isLoading}
                label={isNew ? txt.forms.cancel : txt.questions.delete}
                onClick={onDelete}
                className='bg-dark-red hover:bg-dark-red/70'
            />
        </div>
    );
}
