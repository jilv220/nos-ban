/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    colors: {
      "background": "#111111",
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
          "neutral": "#121212",
          "base-100": "#1d1d1d",
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
