/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#333', // couleur primaire
                secondary: '#FF6187', // couleur secondaire
                accent: '#10B981',
                dark: '#111827',
                light: '#F9FAFB',
                text_primary: '#333',
                textsecondary: '#FF6187',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            container: {
                center: true,
                padding: '1rem',
            },
        },
    },
    plugins: [],
};
