import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './hooks/**/*.{js,ts,jsx,tsx}',
        './lib/**/*.{js,ts,jsx,tsx}',
        './store/**/*.{js,ts,jsx,tsx}',
        './context/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                'primary-light': 'var(--color-primary-light)',
                'primary-dark': 'var(--color-primary-dark)',
                'accent-light': 'var(--color-accent-light)',
                'accent-dark': 'var(--color-accent-dark)',
                'absolute-black': 'var(--color-absolute-black)',
                'light-green': 'var(--color-light-green)',
                'light-yellow': 'var(--color-light-yellow)',
                'light-red': 'var(--color-light-red)',
                'dark-red': 'var(--color-dark-red)',
                'dark-green': 'var(--color-dark-green)',
                'light-gray': 'var(--color-light-gray)',
                'grey': 'var(--color-grey)',
                'blue-accent': 'var(--color-blue-accent)',
                'blue-dark': 'var(--color-blue-dark)',
            },
            fontFamily: {
                // Font is handled by Next.js font optimization in layout.tsx (Nunito)
                sans: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
            },
            spacing: {},
            animation: {},
            screens: {}
        },
    },
    plugins: [],
};

export default config;
