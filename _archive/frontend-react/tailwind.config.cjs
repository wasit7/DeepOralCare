/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          900: '#163168',
        },
        orange: {
          100: '#f2ad4e',
        },
      },
    },
  },
  plugins: [],
}