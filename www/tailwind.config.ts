import type { Config } from "tailwindcss";
import { TAILWIND_ANIMATIONS, TAILWIND_KEYFRAMES } from "./tailwind/animations";
import { TAILWIND_HEIGHTS } from "./tailwind/heights";

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
    height: TAILWIND_HEIGHTS
  },
} satisfies Config;
