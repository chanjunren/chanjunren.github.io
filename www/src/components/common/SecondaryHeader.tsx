import { FC, PropsWithChildren } from "react";

const SecondaryHeader: FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => {
  return (
    <span
      className={`uppercase text-[var(--reduced-emphasis-color)] ${className}`}
    >
      {children}
    </span>
  );
};

export default SecondaryHeader;
