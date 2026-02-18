/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Japanese traditional font setup if needed, for jump defaults are fine
        sans: ['"Hiragino Kaku Gothic ProN"', '"Hiragino Sans"', 'Meiryo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
