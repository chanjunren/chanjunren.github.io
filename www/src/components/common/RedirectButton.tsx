import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { FC } from "react";
interface IBackButton {
  className?: string;
  label?: string;
  path: string;
}

const RedirectButton: FC<IBackButton> = ({ className, label, path }) => {
  return (
    <a
      className={`!no-underline !text-[var(--ifm-font-color-base)] text-center flex items-center w-fit ${className} hover:bg-[var(--gray-transparent-bg)] py-2 px-4 rounded-md transition-all`}
      href={path}
      target={"_self"}
    >
      <ChevronLeftIcon />
      {label}
    </a>
  );
};

export default RedirectButton;
