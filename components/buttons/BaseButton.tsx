import React from 'react';

type ActionProps =
  | { link: string; onClick?: never }
  | { link?: never; onClick: () => void };

interface OwnProps {
  label: string;
}

type BaseButtonProps = OwnProps & ActionProps;

const BaseButton: React.FC<BaseButtonProps> = ({ label, link, onClick }) => {
  return (
    <button
      className='hover:bg-accent select-none border-2 border-black bg-primaryLight p-4 text-xl font-extrabold uppercase hover:cursor-pointer hover:bg-accentLight md:p-10'
      onClick={onClick}
    >
      {link ? <a href={link}>{label}</a> : <p className='text-wrap'>{label}</p>}
    </button>
  );
};

export default BaseButton;
