import { txt } from '@/nls/texts';
import { AdminOnly } from '../../auth/AdminOnly';
import ActionButton from '../../buttons/ActionButton';

interface Props {
    isSubmitting: boolean;
    isModified: boolean;
    isFormInvalid?: boolean;
    isPastDeadline: boolean;
    onSubmit: () => void;
    onEdit?: () => void;
}

export default function QuestionFooterButtons({
    isSubmitting,
    isModified,
    isFormInvalid = false,
    isPastDeadline,
    onSubmit,
    onEdit,
}: Props) {
    return (
        <div className='mt-4 flex flex-row justify-between'>
            <ActionButton
                loading={isSubmitting}
                label={
                    isModified && !isPastDeadline
                        ? txt.forms.save
                        : txt.forms.saved
                }
                onClick={onSubmit}
                disabled={!isModified || isFormInvalid || isPastDeadline}
            />
            <AdminOnly>
                {onEdit && (
                    <ActionButton label={txt.forms.edit} onClick={onEdit} />
                )}
            </AdminOnly>
        </div>
    );
}
