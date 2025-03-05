import { FC, useState } from "react";
import ExperimentBackground from "../../helpers/ExperimentBackground";

const Handwave: FC = () => {
  const [wave, setWave] = useState<boolean>(false);

  return (
    <ExperimentBackground>
      <div
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
      </div>
    </ExperimentBackground>
  );
};

export default Handwave;
