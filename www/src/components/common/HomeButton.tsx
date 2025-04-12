import { FC, ReactElement, useState } from "react";
import TypewriterText from "./TypewriterText";

interface IHomeButton {
  link: string;
  external?: boolean;
  main: ReactElement | string;
  subtitle?: string;
  className?: string;
}

const HomeButton: FC<IHomeButton> = ({
  className,
  main,
  link,
  external = false,
  subtitle,
}) => {
  const [hover, setHover] = useState<boolean>(false);

  return (
    <a
      className={`rounded-md !no-underline !text-[var(--ifm-font-color-base)] text-center flex items-center ${className} md:p-0 md:bg-transparent p-3 bg-gray-400 bg-opacity-10 backdrop-blur-2xl justify-center md:justify-start`}
      href={link}
      target={external ? "_blank" : "_self"}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {main}
      {subtitle && (
        <TypewriterText
          className="ml-3 hidden md:block text-lg"
          active={hover}
          text={subtitle}
        />
      )}
      {subtitle && <span className="ml-3 block md:hidden">{subtitle}</span>}
    </a>
  );
};

export default HomeButton;
