import { FC, PropsWithChildren } from "react";

const PrimaryHeader: FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => {
  return (
    <h6
      className={`text-md uppercase
        !font-light
        bg-gray-200 bg-opacity-5
        w-fit rounded-3xl 
        px-5 py-3 md:justify-self-start justify-self-center 
        ${className}`}
    >
      {children}
    </h6>
  );
};

export default PrimaryHeader;
