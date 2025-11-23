import { FC, PropsWithChildren, ReactNode } from "react";
import SecondaryHeader from "./secondary-header";

type MiniSectionProps = {
  title: ReactNode;
  subtitle: string;
  //   logoSrc: string;
};
const MiniSection: FC<PropsWithChildren<MiniSectionProps>> = ({
  children,
  //   logoSrc,
  title,
  subtitle,
}) => {
  return (
    <div className="flex flex-col gap-1 mb-5">
      {title}
      <SecondaryHeader>{subtitle}</SecondaryHeader>
      {children}
    </div>
  );
};

export default MiniSection;
