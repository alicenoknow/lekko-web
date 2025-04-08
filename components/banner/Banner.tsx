import React, { memo } from 'react';
import { txt } from '@/nls/texts';
import { LinkButton } from '../buttons';

const Banner: React.FC = () => {
    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='z-[3] mb-32 mt-auto md:mb-24'>
                <LinkButton
                    label={txt.home.joinFb}
                    link='https://www.facebook.com/groups/715213372162917/'
                />
            </div>
        </div>
    );
};
export default memo(Banner);
