import { FC, MouseEventHandler, PropsWithChildren } from "react";

type HoverCardProps = {
  className?: string;
  onClick?: MouseEventHandler;
};
const SimpleCard: FC<PropsWithChildren<HoverCardProps>> = ({
  children,
  className,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`${className} rounded-md cursor-pointer bg-[var(--gray-transparent-bg)]`}
    >
      {children}
    </div>
  );
};

export default SimpleCard;
