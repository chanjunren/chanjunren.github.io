import type { Config } from "tailwindcss";
import { TAILWIND_ANIMATIONS, TAILWIND_KEYFRAMES } from "./tailwind/animations";
import { TAILWIND_BG_IMAGES } from "./tailwind/backgroundImages";
import { TAILWIND_HEIGHTS, TAILWIND_MIN_HEIGHTS } from "./tailwind/heights";
import { TAILWIND_SCREENS } from "./tailwind/screens";

module.exports = {
  corePlugins: {
    preflight: false,
    container: false,
  },
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{jsx,tsx,html}"],
  plugins: [],
  theme: {
    extend: {
      keyframes: TAILWIND_KEYFRAMES,
      animation: TAILWIND_ANIMATIONS,
      height: TAILWIND_HEIGHTS,
      minHeight: TAILWIND_MIN_HEIGHTS,
      screens: TAILWIND_SCREENS,
      backgroundImage: TAILWIND_BG_IMAGES,
    },
  },
} satisfies Config;
