import type { Config } from "tailwindcss";
import { TAILWIND_ANIMATIONS, TAILWIND_KEYFRAMES } from "./src/css/animations";

module.exports = {
  corePlugins: {
    preflight: false,
    container: false,
  },
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{jsx,tsx,html}"],
  plugins: [],
  theme: {
    keyframes: TAILWIND_KEYFRAMES,
    animation: TAILWIND_ANIMATIONS,
  },
} satisfies Config;