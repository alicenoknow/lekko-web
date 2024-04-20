import { IconType } from 'react-icons';
import { FaCheck } from 'react-icons/fa';
import { MdOutlineErrorOutline } from 'react-icons/md';

interface StatusPageProps {
    params: {
        status: string;
    };
}

interface StatusResponse {
    text: string;
    icon: IconType;
}

const errorResponse: StatusResponse = {
    text: 'Coś poszło nie tak, spróbuj ponownie',
    icon: MdOutlineErrorOutline,
};
const successResponse: StatusResponse = { text: 'Udało się!', icon: FaCheck };

function StatusPage({ params }: StatusPageProps) {
    const { status } = params;

    const getMessageFromStatus = (): StatusResponse => {
        if (status === '200') {
            return successResponse;
        } else if (status.startsWith('5')) {
            return errorResponse;
        } else {
            return errorResponse;
        }
    };

    const { text, icon: Icon } = getMessageFromStatus();

    return (
        <div className='m-auto flex flex-row items-center justify-center p-4'>
            <Icon className='mr-6' size={36} />
            <p className='text-wrap text-xl font-semibold uppercase'>{text}</p>
        </div>
    );
}

export default StatusPage;
