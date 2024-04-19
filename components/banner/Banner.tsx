import React from 'react';
import BaseButton from '../buttons/BaseButton';
import Rings from './Rings';
import LayeredText from './LayeredText';

const Banner: React.FC = () => {
    return (
        <div className='absolute inset-0 flex flex-col items-center justify-center'>
            <LayeredText />
            <div className='z-[3] mb-32 mt-auto md:mb-24'>
                <BaseButton
                    label='Dołącz do Lekkoatletawki'
                    link='https://www.facebook.com/groups/715213372162917/'
                />
            </div>
            <Rings />
        </div>
    );
};
export default React.memo(Banner);
