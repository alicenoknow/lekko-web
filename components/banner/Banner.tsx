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
        <div className='relative flex min-h-0 w-full flex-grow flex-col items-center overflow-hidden'>
            <div className='h-[60vh] w-full overflow-hidden'>
                <RunningTrack />
            </div>
            <div className='flex flex-col items-center space-y-6 pb-12'>
                <span className='px-4 text-primary-dark max-w-4xl text-center text-4xl font-bold tracking-widest uppercase md:text-7xl'>
                    Lekko<wbr />atletawka
                </span>
                <ExternalLinkButton
                    label={txt.home.joinFb}
                    link={EXTERNAL_LINKS.facebook}
                    className='bg-accent-dark hover:bg-primary-dark text-white'
                />
            </div>
        </div>
    );
};

export default memo(Banner);
