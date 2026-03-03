import React from 'react';
import Avatar from './Avatar';
import Points from '../questions/common/Points';

interface Props {
    index: number;
    username: string;
    points: number;
}

function UserRank({ index, username, points }: Props) {
    return (
        <div className='border-light-gray flex flex-row items-center justify-between gap-4 rounded-xl border bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md'>
            <div className='flex flex-row items-center gap-4'>
                <span className='text-primary-dark w-8 text-center text-lg font-bold'>
                    {index}.
                </span>
                <Avatar username={username} size={36} />
                <span className='text-primary-dark text-lg font-bold'>
                    {username}
                </span>
            </div>
            <Points maxPoints={points} />
        </div>
    );
}

export default React.memo(UserRank);
