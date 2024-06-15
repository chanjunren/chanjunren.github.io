import { FC } from "react";

type TypewriterTextProps = {
  text: string;
  active: boolean;
};

const TypewriterText: FC<TypewriterTextProps> = ({ text, active }) => {
  return (
    <span
      style={
        {
          "--text-length": text.length,
        } as React.CSSProperties
      }
      className={`font-mono w-0 overflow-hidden max-w-fit text-nowrap size-fit border-solid border-0 ${
        active
          ? "animate-typewriter pr-1 border-r-8 border-r-[var(--ifm-font-color-base)]"
          : ""
      }`}
    >
      {text}
    </span>
  );
};

export default TypewriterText;
