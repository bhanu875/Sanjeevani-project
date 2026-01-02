/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sanjeevani: {
          green: {
            dark: "#2F4F3E",
            DEFAULT: "#4F685D",
            light: "#7D9A92",
            soft: "#E6F0EA",
          },
          brown: {
            dark: "#4A3B2A",
            DEFAULT: "#7A5C3E",
            light: "#E8E0D3",
          },
        },
      },
    },
  },
  plugins: [],
};
