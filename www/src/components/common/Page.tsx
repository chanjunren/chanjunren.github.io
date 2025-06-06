import Layout from "@theme/Layout";
import { FC, PropsWithChildren, ReactElement } from "react";
import FloatingMenu from "../home/floatingmenu";
import LitFooter from "./LitFooter";

type IPage = {
  title: string;
  description?: string;
  footer?: ReactElement;
  className?: string;
};

const Page: FC<PropsWithChildren<IPage>> = ({
  title,
  description = "Hi there! I'm Jun Ren",
  children,
  footer = <LitFooter />,
  className,
}) => {
  return (
    <Layout
      wrapperClassName="flex flex-col justify-between min-h-screen-minus-navbar pt-7 px-7 items-center gap-10"
      title={title}
      description={description}
    >
      <main className={`lg:max-w-6xl w-full flex-grow ${className}`}>
        {children}
      </main>
      {footer}
      <FloatingMenu />
    </Layout>
  );
};

export default Page;
