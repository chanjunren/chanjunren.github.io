import { FC, HtmlHTMLAttributes, PropsWithChildren } from "react";

const PixelLabContainer: FC<
  PropsWithChildren<HtmlHTMLAttributes<HTMLDivElement> & { label: string }>
> = ({ children, label, ...props }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-md bg-[var(--ifm-background-color)] h-40 w-40 border-gray-200 border-solid">
      <div
        {...props}
        className={`aspect-square flex items-center justify-center ${props.className} flex-grow`}
      >
        {children}
      </div>
      <span className="pb-5">[{label}]</span>
    </div>
  );
};

export default PixelLabContainer;
