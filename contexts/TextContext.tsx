'use client';

import React, { createContext, useState, useEffect } from 'react';
import textsData from '../nls/main.json';

const TextContext = createContext(textsData);

const TextProvider = ({ children }: React.PropsWithChildren) => {
    const [texts, setTexts] = useState(textsData);

    useEffect(() => {
        setTexts(textsData);
    }, []);

    return (
        <TextContext.Provider value={texts}>{children}</TextContext.Provider>
    );
};

export { TextContext, TextProvider };
