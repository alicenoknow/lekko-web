import React from 'react';
import { FaGithub } from 'react-icons/fa';

// TODO extract from code
const currentYear = '2024';
const founder = {
  name: 'Krystian Wieteska',
};
const creators = [
  { name: 'Alicja Niewiadomska', github: 'https://github.com/alicenoknow' },
  { name: 'Filip Juza', github: 'https://github.com/filipio' },
];
// TODO read how it works
const license = 'All rights reserved.';

const Footer = () => {
  const OwnerFooter = React.memo(function OwnerFooter() {
    return (
      <div>
        <p>Founded by: {founder.name}</p>
        <p>
          © {currentYear} {license}
        </p>
      </div>
    );
  });

  const CreatorsFooter = React.memo(function CreatorsFooter() {
    return (
      <div className='ml-8 flex items-center '>
        <ul>
          {creators.map((creator, index) => (
            <li key={index}>
              <a
                href={creator.github}
                target='_blank'
                rel='noopener noreferrer'
                className='hover:pointer hover:text-accentLight flex items-center'
              >
                <FaGithub className='mr-2' /> {creator.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  });

  return (
    <footer className='z-[3] flex items-center justify-evenly border-t p-2 uppercase'>
      <OwnerFooter />
      <CreatorsFooter />
    </footer>
  );
};

export default Footer;
