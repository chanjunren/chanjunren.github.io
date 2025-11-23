import { FC, HtmlHTMLAttributes, PropsWithChildren } from "react";

const PixelLabContainer: FC<
  PropsWithChildren<HtmlHTMLAttributes<HTMLDivElement> & { label: string }>
> = ({ children, label, ...props }) => {
  return (
    <div className="flex flex-col items-center justify-center h-40 w-40">
      <div
        {...props}
        className={`aspect-square flex items-center justify-center ${props.className} flex-grow`}
      >
        {children}
      </div>
      <span className="pb-2">[{label}]</span>
    </div>
  );
};

export default PixelLabContainer;
