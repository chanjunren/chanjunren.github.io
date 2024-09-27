import { FC } from "react";
import TypewriterText from "../common/TypewriterText";

const BuildingInProgress: FC = () => {
  return (
    // <span className="flex-grow mt-[10%] font-mono after:content-['|'] after:animate-blink after:bg-[var(--ifm-font-color-base)]">
    <div className="flex-grow flex items-center">
      <TypewriterText text="🔨 Building in progress..." active />
    </div>
    // </span>
  );
};

export default BuildingInProgress;
