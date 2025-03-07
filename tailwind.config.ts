import type { Config } from "tailwindcss";

import { heroui } from "@heroui/theme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/components/(button|input|link|listbox|navbar|card|image).js",
    "./node_modules/@heroui/theme/dist/components/tooltip.js",
  ],
  theme: {
    extend: {
      colors: {
        "cookeri-green": "#02D084",
        "cookeri-green-light": "rgba(179, 241, 218, 0.42)",
        "light-black": "#252627",
        "lighter-black": "#303132",
        "lightest-black": "#515152",
        "light-grey": "#EBECF0",
        "lighter-grey": "#a3a3a3",
        "glass-white": "rgba(255, 255, 255, 0.09)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "cook-collage": "url('/cook-collage.svg')",
      },
      fontFamily: {
        gluten: ["var(--font-gluten)"],
        "league-spartan": ["var(--font-league-spartan)"],
      },
      animation: {
        "fade-in": "fadeIn 1s ease",
        "fade-in-down": "fadeInUp 1s ease",
        "fade-in-left": "fadeInLeft 1s ease",
        "zoom-in": "zoomIn 1s ease",
      },
    },
  },
  plugins: [heroui()],
};
export default config;
