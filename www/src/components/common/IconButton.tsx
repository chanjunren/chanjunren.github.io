import { FC, PropsWithChildren } from "react";

const IconButton: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <button className="hover:bg-[var(--gray-transparent-bg)] border-none bg-transparent p-2 rounded-md flex align-center justify-center cursor-pointer">
      {children}
    </button>
  );
};

export default IconButton;
