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
      className={`${className} rounded-md cursor-pointer bg-[var(--gray-transparent-bg)] hover:bg-[var(--rose-hover)] hover:shadow-2xl hover:scale-105 transition-all`}
    >
      {children}
    </div>
  );
};

export default HoverCard;
