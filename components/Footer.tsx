'use client';

import React from 'react';
import { FaGithub } from 'react-icons/fa';

const currentYear = new Date().getFullYear();
const license = 'Wszystkie prawa zastrzeżone';

const founder = {
    name: 'Krystian Wieteska',
};

const creators = [
    { name: 'Alicja Niewiadomska', github: 'https://github.com/alicenoknow' },
    { name: 'Filip Juza', github: 'https://github.com/filipio' },
];

const Footer = () => (
    <footer className='z-[3] flex flex-col items-center justify-center gap-2 border-t p-4 text-xs uppercase md:flex-row md:justify-evenly md:text-base'>
        <div className='text-center md:text-left'>
            <p>{founder.name}</p>
            <p>© {currentYear} {license}</p>
        </div>

        <div className='flex flex-col items-center md:ml-8 md:items-start'>
            <ul className='space-y-1'>
                {creators.map((creator) => (
                    <li key={creator.name}>
                        <a
                            href={creator.github}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center gap-2 hover:text-lightGray'
                        >
                            <FaGithub /> {creator.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    </footer>
);

export default Footer;
