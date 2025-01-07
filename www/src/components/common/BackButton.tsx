import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { FC } from "react";
interface IBackButton {
  className?: string;
}

const BackButton: FC<IBackButton> = ({ className }) => {
  return (
    <a
      className={`decoration-solid !no-underline !text-[var(--ifm-font-color-base)] transition-none text-center flex items-center w-fit ${className} hover:bg-[var(--gray-transparent-bg)] p-2 rounded-md transition-all`}
      href={"/"}
      target={"_self"}
    >
      <ChevronLeftIcon />
      back
    </a>
  );
};

export default BackButton;
