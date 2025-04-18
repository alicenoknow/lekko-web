import { COUNTRIES } from '@/lib/Countries';
import Flag from 'react-world-flags';

interface Props {
    code: string;
}

export default function CountryLabel({ code }: Props) {
    return (
        <div className='flex flex-row items-center'>
            <Flag className='mr-2 h-6 w-6' code={code} />{' '}
            {COUNTRIES[code] ?? code}
        </div>
    );
}
