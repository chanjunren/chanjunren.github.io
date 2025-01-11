import { FC, MouseEventHandler, PropsWithChildren } from "react";

type HoverCardProps = {
  className?: string;
  onClick?: MouseEventHandler;
};
const HoverCard: FC<PropsWithChildren<HoverCardProps>> = ({
  children,
  className,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`${className} rounded-md cursor-pointer bg-[var(--gray-transparent-bg)] transition-all`}
    >
      {children}
    </div>
  );
};

export default HoverCard;
