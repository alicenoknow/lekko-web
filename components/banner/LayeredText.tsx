import React, { useMemo } from 'react';

const textLine1 = 'LEKKO';
const textLine2 = 'ATLET';
const textLine3 = 'AWKA';

const LayeredText: React.FC = () => {
  const text = useMemo(
    () => (
      <>
        <p>{textLine1}</p>
        <span className='block md:inline'>{textLine2}</span>
        <span className='block md:inline'>{textLine3}</span>
      </>
    ),
    []
  );

  return (
    <>
      <div className='text-banner z-[1] text-wrap text-absoluteBlack'>
        {text}
      </div>
      <div className=':text-banner md:text-banner md:text-blur z-[3] text-wrap'>
        {text}
      </div>
      <div className='text-banner text-front z-[3] text-wrap'>{text}</div>
    </>
  );
};
export default React.memo(LayeredText);
