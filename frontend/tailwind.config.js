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
        primary: '#B8DB80',
        'background-light': '#F7F6D3',
        accent: '#FFE4EF',
        'accent-strong': '#F39EB6',
      },
    },
  },
  plugins: [],
}
