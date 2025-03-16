import { FC, PropsWithChildren } from "react";

const PrimaryHeader: FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => {
  return (
    <h4
      className={`uppercase font-light bg-gray-600 bg-opacity-10 backdrop-blur-2xl w-fit rounded-3xl px-5 py-3 mb-10 ${className}`}
    >
      {children}
    </h4>
  );
};

export default PrimaryHeader;
