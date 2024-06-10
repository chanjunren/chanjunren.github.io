import { FC, PropsWithChildren, ReactNode } from "react";
import SecondaryHeader from "../common/SecondaryHeader";

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
    // <div className="flex gap-3">
    //   <Image
    //     className={"max-w-10 max-h- rounded-md"}
    //     img={useBaseUrl(logoSrc)}
    //   />
    <div className="flex flex-col gap-1 mb-5">
      {title}
      <SecondaryHeader>{subtitle}</SecondaryHeader>
      {children}
    </div>
    // </div>
  );
};

export default MiniSection;
