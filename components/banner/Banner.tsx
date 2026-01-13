import React, { memo } from 'react';
import { txt } from '@/nls/texts';
import ExternalLinkButton from '../buttons/ExternalLinkButton';
import RunningTrack from './RunningTrack';

const EXTERNAL_LINKS = {
    facebook:
        process.env.NEXT_PUBLIC_FACEBOOK_URL ||
        'https://www.facebook.com/groups/715213372162917/',
} as const;

const Banner: React.FC = () => {
    return (
        <div className='relative flex w-full flex-grow flex-col items-center justify-center overflow-hidden text-center'>
            <div className='relative z-10 flex flex-col items-center space-y-12 px-4 md:space-y-24'>
                <span className='max-w-4xl text-3xl font-bold uppercase tracking-widest md:text-7xl'>
                    {txt.home.title}
                </span>
                <ExternalLinkButton
                    label={txt.home.joinFb}
                    link={EXTERNAL_LINKS.facebook}
                />
            </div>
            <RunningTrack />
        </div>
    );
};

export default memo(Banner);
