import { FC, HtmlHTMLAttributes, PropsWithChildren } from "react";

const ExperimentBackground: FC<
  PropsWithChildren<HtmlHTMLAttributes<HTMLDivElement>>
> = ({ children, ...props }) => {
  return (
    <div
      {...props}
      className={`h-20 aspect-square flex items-center justify-center hover:bg-[var(--gray-transparent-bg)] rounded-md transition-all ${props.className}`}
    >
      {children}
    </div>
  );
};

export default ExperimentBackground;
