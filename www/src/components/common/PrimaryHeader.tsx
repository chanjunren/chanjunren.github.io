import { FC, PropsWithChildren } from "react";

const PrimaryHeader: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <h4 className="uppercase cursor-alias hover:underline decoration-2 decoration-wavy decoration-[var(--ifm-color-primary)]">
      {children}
    </h4>
  );
};

export default PrimaryHeader;
