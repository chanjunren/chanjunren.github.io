import { FC, useState } from "react";
import PixelLabContainer from "../../helpers/PixelLabContainer";

const HandWave: FC = () => {
  const [wave, setWave] = useState<boolean>(false);

  return (
    <PixelLabContainer
      label="001"
      onMouseEnter={() => {
        if (!wave) {
          setWave(true);
          setTimeout(() => {
            setWave(false);
          }, 1000);
        }
      }}
    >
      <div
        className={`handwave w-fit text-3xl cursor-cell ${
          wave ? "animate-handwave" : ""
        }`}
      >
        👋🏻
      </div>
    </PixelLabContainer>
  );
};

export default HandWave;
