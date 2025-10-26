import { FC } from "react";

type TagColor = "rose" | "pine" | "foam" | "iris" | "muted";

type HeaderTagProps = {
  label: string;
  color: TagColor;
  className?: string;
};

// Color mappings from Rosé Pine Dawn palette
// Using lighter backgrounds with darker text for better contrast
const COLOR_STYLES: Record<TagColor, { bg: string; text: string }> = {
  rose: {
    bg: "bg-[#b4637a]/40",
    text: "text-rose-950", // Love color - darker rose
  },
  pine: {
    bg: "bg-[#286983]/40",
    text: "text-[#286983]", // Pine is already fairly dark
  },
  foam: {
    bg: "bg-[#56949f]/40",
    text: "text-[#286983]", // Using pine for darker teal
  },
  iris: {
    bg: "bg-[#907aa9]/40",
    text: "text-[#575279]", // Text color - much darker purple/gray
  },
  muted: {
    bg: "bg-[##9893a5]/40",
    text: "text-[#575279]", // Text color - much darker purple/gray
  },
};

const HeaderTag: FC<HeaderTagProps> = ({ label, color, className = "" }) => {
  const colorStyle = COLOR_STYLES[color];

  return (
    <span
      className={`${colorStyle.bg} ${colorStyle.text} inline-block rounded text-md px-1.5 pt-0.5 pb-1 tracking-tight button-shadow ${className}`}
    >
      {label}
    </span>
  );
};

export default HeaderTag;
