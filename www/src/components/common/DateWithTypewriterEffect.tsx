import { FC } from "react";

type DateWithTypewriterEffectProps = {
  date: string;
  active: boolean;
};

const DateWithTypewriterEffect: FC<DateWithTypewriterEffectProps> = ({
  date,
  active,
}) => {
  return (
    <span
      className={`font-mono w-0 overflow-hidden max-w-fit text-nowrap ${
        active ? "animate-typewriterDate" : ""
      }`}
    >
      {date}
    </span>
  );
};

export default DateWithTypewriterEffect;
