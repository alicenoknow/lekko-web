import { txt } from '@/nls/texts';
import { FaPlus } from 'react-icons/fa';
import ActionButton from '../buttons/ActionButton';

interface Props {
    onEventAdd: () => void;
}

export default function AddEvent({ onEventAdd }: Props) {
    return (
        <ActionButton
            label={
                <span className='flex items-center gap-2'>
                    <FaPlus />
                    <span className='hidden text-lg md:inline'>
                        {txt.events.newEvent}
                    </span>
                </span>
            }
            onClick={onEventAdd}
        />
    );
}
