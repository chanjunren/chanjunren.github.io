import { Config } from "tailwindcss";

export const TAILWIND_ANIMATIONS: Config["theme"]["animations"] = {
  typewriter:
    "typewriter 1s steps(var(--text-length)) forwards, borderBlink 1.5s infinite",
  handwave: "handwave 1s ease-in-out",
};

export const TAILWIND_KEYFRAMES: Config["theme"]["keyframes"] = {
  typewriter: {
    to: { width: "100%" },
  },
  borderBlink: {
    "50%": {
      borderRightColor: "rgba(0,0,0,0)",
    },
  },
  handwave: {
    "0%, 50%, 100%": {
      transform: "rotate(0deg)",
      transformOrigin: "bottom right",
    },
    "25%, 75%": {
      transform: "rotate(-17deg)",
      transformOrigin: "bottom right",
    },
  },
};
