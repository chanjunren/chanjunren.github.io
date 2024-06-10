import { FC, PropsWithChildren } from "react";

const SecondaryHeader: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <span className="uppercase text-[var(--reduced-emphasis-color)]">
      {children}
    </span>
  );
};

export default SecondaryHeader;
