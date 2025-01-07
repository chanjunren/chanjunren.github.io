import Layout from "@theme/Layout";
import { FC, PropsWithChildren, ReactElement } from "react";
import LitFooter from "./LitFooter";

type PageProps = {
  title: string;
  description?: string;
  footer?: ReactElement;
};
const Page: FC<PropsWithChildren<PageProps>> = ({
  title,
  description = "Hi there! I'm Jun Ren",
  children,
  footer = <LitFooter />,
}) => {
  return (
    <Layout title={title} description={description}>
      <main
        id="view-transition-container"
        className="flex flex-col justify-between min-h-screen-minus-navbar p-7 items-center"
      >
        {children}
        {footer}
      </main>
    </Layout>
  );
};

export default Page;
