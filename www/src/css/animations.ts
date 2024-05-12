import { Config } from "tailwindcss";

export const TAILWIND_ANIMATIONS: Config["theme"]["animations"] = {
  "bouncing-show": "bouncing-show 0.7s ease-in-out forwards",
};

export const TAILWIND_KEYFRAMES: Config["theme"]["keyframes"] = {
  "bouncing-show": {
    "50%": { transform: "translateY(-0.20rem)" },
    "100%": { transform: "translateY(0rem)", opacity: "1" },
  },
};
