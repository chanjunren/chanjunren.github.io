import { Config } from "tailwindcss";

export const TAILWIND_ANIMATIONS: Config["theme"]["animations"] = {
  bouncingShow: "bouncing-show 0.7s linear forwards",
  typewriterDate: "typewriterDate 2s steps(12) forwards",
  blink: "blink 1s infinite",
};

export const TAILWIND_KEYFRAMES: Config["theme"]["keyframes"] = {
  "bouncing-show": {
    "50%": { transform: "translateY(-0.20rem)" },
    "100%": { transform: "translateY(0rem)", opacity: "1" },
  },
  typewriterDate: {
    from: { "border-right": "10px solid var(--ifm-font-color-base)" },
    to: { width: "100%" },
  },
  blink: {
    "50%": {
      opacity: "0",
    },
  },
};
