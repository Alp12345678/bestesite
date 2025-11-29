/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-open-sans)', 'sans-serif'],
        dancing: ['var(--font-dancing-script)', 'cursive'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
