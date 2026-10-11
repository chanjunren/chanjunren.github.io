import { cn } from "@site/src/lib/utils";
import Align from "@site/src/components/projects/pixelLab/experiments/align";
import Checkbox from "@site/src/components/projects/pixelLab/experiments/checkbox";
import BouncingDownload from "@site/src/components/projects/pixelLab/experiments/download";
import Dustbin from "@site/src/components/projects/pixelLab/experiments/dustbin";
import HandWave from "@site/src/components/projects/pixelLab/experiments/handwave";
import NanCircle1 from "@site/src/components/projects/pixelLab/experiments/nancircle1";
import PaperPlane from "@site/src/components/projects/pixelLab/experiments/paperplane";
import { FC } from "react";
import styles from "./card.module.css";

// Graph and Chart use fixed SVG ids, so they stay out of the duplicated strip.
const STRIP = [
  HandWave,
  PaperPlane,
  Align,
  Dustbin,
  BouncingDownload,
  NanCircle1,
  Checkbox,
];

const PixelLabCard: FC<{ onClick: () => void }> = ({ onClick }) => (
  <div
    onClick={onClick}
    className={cn(
      "relative flex flex-grow cursor-pointer items-center overflow-hidden rounded-lg shadow-md",
      styles.card,
    )}
  >
    <div className="origin-left scale-[0.8]">
      <div className={cn("flex w-max", styles.track)}>
        {[...STRIP, ...STRIP].map((Experiment, i) => (
          <Experiment key={i} />
        ))}
      </div>
    </div>
  </div>
);

export default PixelLabCard;
