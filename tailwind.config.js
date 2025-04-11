/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/{App,app,Error,error}.vue",
    "./src/{components,layouts,pages,composables,plugins}/**/*.{js,jsx,ts,tsx,vue}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: `#FF7700`,
        },
        secondary: {
          DEFAULT: `#140D0B`,
        },
        gray: {
          300: "#B8BBC3",
          600: "#252F38",
          800: "#1A242D",
        },
      },
      fontFamily: {},
      screens: {
        "3xl": "1920px",
      },
    },
  },
  plugins: [],
};
