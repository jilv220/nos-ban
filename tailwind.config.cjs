/* eslint-disable prettier/prettier */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    colors: {
      "black": "#111111",
      "white": "#ffffff"
    },
    extend: {}
  },
  daisyui: {
    themes: [
      {
        mydark: {
          "primary": "#de0050",
          "secondary": "#ef6698",
          "accent": "#00e8c6",
          "neutral": "#1d1d1d",
          "base-100": "#0c0e14",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
    ],
  },
  plugins: [require("daisyui")]
};
