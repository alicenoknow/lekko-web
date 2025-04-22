import React from 'react';
import Label from '../forms/Label';
import Avatar from './Avatar';
import Points from '../questions/common/Points';

interface Props {
    index: number;
    username: string;
    points: number;
}

function UserRank({ index, username, points }: Props) {
    return (
        <div className='flex flex-row items-center justify-between gap-4 bg-white/80 p-4 px-8'>
            <div className='flex flex-row items-center justify-between gap-4'>
                <Label label={index} />
                <Avatar username={username} />
                <Label label={username} />
            </div>
            <Points maxPoints={points} />
        </div>
    );
}

export default React.memo(UserRank);
