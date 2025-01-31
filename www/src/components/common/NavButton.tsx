import { ArrowTopLeftIcon } from "@radix-ui/react-icons";
import { FC } from "react";

interface INavButton {
  className?: string;
  label?: string;
  path: string;
}

const NavButton: FC<INavButton> = ({ className, label, path }) => {
  return (
    <a
      className={`!no-underline !text-[var(--ifm-font-color-base)] text-center flex items-center w-fit ${className} hover:bg-[var(--gray-transparent-bg)] py-2 px-4 rounded-md transition-all`}
      href={path}
      target={"_self"}
    >
      <ArrowTopLeftIcon className="mr-2" />
      {label}
    </a>
  );
};

export default NavButton;
