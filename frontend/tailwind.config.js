/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#59AC77',
          dark: '#3A6F43',
        },
        accent: {
          DEFAULT: '#FDAAAA',
          light: '#FFD5D5',
        },
      },
    },
  },
  plugins: [],
}

