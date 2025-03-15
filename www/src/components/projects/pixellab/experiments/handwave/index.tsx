import { FC, useState } from "react";
import ExperimentBackground from "../../helpers/ExperimentBackground";

const Handwave: FC = () => {
  const [wave, setWave] = useState<boolean>(false);

  return (
    <ExperimentBackground
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
    </ExperimentBackground>
  );
};

export default Handwave;
