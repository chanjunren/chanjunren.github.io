import Layout from "@theme/Layout";
import { FC, PropsWithChildren, ReactElement } from "react";
import FloatingMenu from "../home/floatingmenu";
import LitFooter from "./lit-footer";

type IPage = {
  title: string;
  description?: string;
  footer?: ReactElement | null;
  menu?: ReactElement | null;
  className?: string;
  wrapperClassName?: string;
};

const Page: FC<PropsWithChildren<IPage>> = ({
  title,
  description = "Hi there! I'm Jun Ren",
  children,
  footer = <LitFooter />,
  menu = <FloatingMenu />,
  className,
  wrapperClassName,
}) => {
  return (
    <Layout
      wrapperClassName={`flex flex-col min-h-screen-minus-navbar items-center gap-10 pb-28 px-7 ${wrapperClassName ?? ""}`}
      title={title}
      description={description}
    >
      <main className={`lg:max-w-6xl w-full grow ${className}`}>
        {children}
      </main>
      {footer}
      {menu}
    </Layout>
  );
};

export default Page;
