/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#bf3a6f',
          secondary: '#ffffff',
        },
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'sins': ['Sins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

