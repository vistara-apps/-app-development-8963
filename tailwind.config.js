/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(230 15% 12%)',
        accent: 'hsl(180 80% 50%)',
        primary: 'hsl(240 88% 60%)',
        surface: 'hsl(230 15% 16%)',
        'text-primary': 'hsl(0 0% 95%)',
        'text-secondary': 'hsl(230 5% 70%)',
      },
      borderRadius: {
        'lg': '12px',
        'md': '8px',
        'sm': '4px',
      },
      spacing: {
        'lg': '24px',
        'md': '16px',
        'sm': '8px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(0, 0%, 0%, 0.12)',
      },
    },
  },
  plugins: [],
}