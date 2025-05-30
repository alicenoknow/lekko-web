import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primaryLight: '#edf4f8',
        primaryDark: '#223239',
        accentLight: '#e1ff1c',
        accentDark: '#2a2b68',
        absoluteBlack: '#000',
        lightGreen: '#93fc8d',
        lightYellow: '#fff2a9',
        lightRed: '#ffaaaa',
        darkRed: '#d32412',
        darkGreen: '#13962d',
        lightGray: '#717171',
      },
    },
  },
  plugins: [],
};
export default config;
