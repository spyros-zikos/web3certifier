/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "dark",
  darkMode: ["selector", "[data-theme='dark']"],
  // DaisyUI theme colors
  daisyui: {
    themes: [
      // {
        // light: {
        //   primary: "#93BBFB",
        //   "primary-content": "#212638",
        //   secondary: "#DAE8FF",
        //   "secondary-content": "#212638",
        //   accent: "#93BBFB",
        //   "accent-content": "#212638",
        //   neutral: "#212638",
        //   "neutral-content": "#ffffff",
        //   "base-100": "#ffffff",
        //   "base-200": "#f4f8ff",
        //   "base-300": "#DAE8FF",
        //   "base-content": "#212638",
        //   info: "#93BBFB",
        //   success: "#34EEB6",
        //   warning: "#FFCF72",
        //   error: "#FF8863",

        //   "--rounded-btn": "9999rem",

        //   ".tooltip": {
        //     "--tooltip-tail": "6px",
        //   },
        //   ".link": {
        //     textUnderlineOffset: "2px",
        //   },
        //   ".link:hover": {
        //     opacity: "80%",
        //   },
        // },
      // },
      {
        dark: {
          primary: "#3b5c0a", // darker green
          "primary-content": "#F9FBFF",
          secondary: "#303036", // lighter black
          "secondary-content": "#F9FBFF",
          accent: "#84cc16",
          "accent-content": "#F9FBFF",
          neutral: "#F9FBFF",
          "neutral-content": "#385183",
          "base-100": "#84cc16", // green
          "base-200": "#18181B", // black
          "base-300": "#a0a0ab", // lighter lighter black
          "base-content": "#F9FBFF", // white
          info: "#48F183",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
            "--tooltip-color": "oklch(var(--p))",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
    ],
  },
  theme: {
    extend: {
      colors: {
        redViolet: "#C71585",
        ligthGray: "#F2F2F2",
      },
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
};
