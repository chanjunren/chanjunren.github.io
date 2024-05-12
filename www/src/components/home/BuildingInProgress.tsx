import { FC } from "react";

const BuildingInProgress: FC = () => {
  return (
    <span className="flex-grow mt-[10%] font-mono after:content-['|'] after:animate-blink after:bg-[var(--ifm-font-color-base)]">
      <span className="mr-2 text-2xl">🔨</span>
      Building in progress...
    </span>
  );
};

export default BuildingInProgress;
