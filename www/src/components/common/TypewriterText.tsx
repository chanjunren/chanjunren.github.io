import { FC } from "react";

type TypewriterTextProps = {
  text: string;
  active: boolean;
  size?: "lg" | "md";
  className?: string;
  color?: string;
};

const TypewriterText: FC<TypewriterTextProps> = ({
  text,
  active,
  size = "md",
  className,
  color = "[var(--ifm-font-color-base)]",
}) => {
  return (
    <span
      style={
        {
          "--text-length": text.length,
          color: color,
        } as React.CSSProperties
      }
      className={`font-mono w-0 overflow-hidden max-w-fit text-nowrap size-fit border-solid border-0 ${
        active ? `animate-typewriter pr-1 border-r-8 border-r-[${color}]` : ""
      } ${size === "lg" ? "text-xl" : ""} ${className}`}
    >
      {text}
    </span>
  );
};

export default TypewriterText;
