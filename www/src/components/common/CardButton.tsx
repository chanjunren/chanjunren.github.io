import { FC, ReactElement } from "react";

interface ICardButton {
  redirect?: string;
  externalLink?: string;
  onClick?: () => void;
  extraProps?: string;
  graphic?: ReactElement;
  title?: string;
  subtitle?: string;
}

const CardButton: FC<ICardButton> = ({
  title,
  subtitle,
  redirect,
  externalLink,
  graphic,
  extraProps,
}) => {
  const content = (
    <div
      className={`flex bg-opacity-5 bg-[var(--overlay)] md:px-10 px-6 py-5 rounded-md items-center place-items-center gap-10 hover:border-[var(--ifm-font-color-base)] border-2 border-solid border-transparent cursor-pointer transition-all hover:shadow-lg ${extraProps} justify-center`}
    >
      {graphic}
      {title && (
        <div className="flex flex-col items-end flex-grow">
          <h3 className="lowercase mb-1">{title}.</h3>
          <span className="lowercase italic">{subtitle}</span>
        </div>
      )}
    </div>
  );
  return redirect || externalLink ? (
    <a
      className="decoration-solid !no-underline !text-[var(--ifm-font-color-base)] transition-none"
      href={externalLink || redirect}
      target={externalLink ? "_blank" : "_self"}
    >
      {content}
    </a>
  ) : (
    content
  );
};

export default CardButton;
