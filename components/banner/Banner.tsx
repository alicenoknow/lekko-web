import React, { memo } from 'react';
import BaseButton from '../buttons/BaseButton';

const Banner: React.FC = () => {
    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='z-[3] mb-32 mt-auto md:mb-24'>
                <BaseButton
                    label='Dołącz do Lekkoatletawki'
                    link='https://www.facebook.com/groups/715213372162917/'
                />
            </div>
        </div>
    );
};
export default memo(Banner);
