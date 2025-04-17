import React, { memo } from 'react';
import { txt } from '@/nls/texts';
import { LinkButton } from '../buttons';

const LEKKO_FB = 'https://www.facebook.com/groups/715213372162917/';

const Banner: React.FC = () => {
    return (
        <div className='flex flex-col items-center justify-center space-y-24 px-4 py-12 text-center'>
            <span className='max-w-4xl text-5xl font-bold uppercase tracking-tight'>
                {txt.home.title}
            </span>
            <LinkButton label={txt.home.joinFb} link={LEKKO_FB} />
        </div>
    );
};
export default memo(Banner);
