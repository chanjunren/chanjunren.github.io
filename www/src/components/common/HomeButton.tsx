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
      className={`!no-underline !text-[var(--ifm-font-color-base)] text-center flex items-center ${className} md:min-w-48`}
      href={link}
      target={external ? "_blank" : "_self"}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {main}
      {subtitle && (
        <TypewriterText
          className="ml-3 hidden md:block"
          active={hover}
          text={subtitle}
        />
      )}
    </a>
  );
};

export default HomeButton;
