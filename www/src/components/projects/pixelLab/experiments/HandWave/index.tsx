import { FC, useState } from "react";

const Handwave: FC = () => {
  const [wave, setWave] = useState<boolean>(false);

  return (
    <span
      onMouseEnter={() => {
        if (!wave) {
          setWave(true);
          setTimeout(() => {
            setWave(false);
          }, 1000);
        }
      }}
      className={`handwave w-fit text-4xl cursor-crosshair ${
        wave ? "animate-handwave" : ""
      }`}
    >
      👋🏻
    </span>
  );
};

export default Handwave;
