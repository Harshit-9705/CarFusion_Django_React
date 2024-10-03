/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        lg: 'inset 0px 2px 0px 0px rgba(255, 255, 255, 0.13)', // Large shadow
      },
    },
  },
  plugins: [],
}
