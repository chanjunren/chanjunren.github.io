import Layout from "@theme/Layout";
import { FC, PropsWithChildren } from "react";
import LitFooter from "./LitFooter";

type LayoutWrapperProps = {
  title: string;
  description?: string;
};
const LayoutWrapper: FC<PropsWithChildren<LayoutWrapperProps>> = ({
  title,
  description = "Hi there! I'm Jun Ren",
  children,
}) => {
  return (
    <Layout title={title} description={description}>
      <main className="flex flex-col justify-between min-h-screen-minus-navbar p-5 items-center">
        {children}
        <LitFooter />
      </main>
    </Layout>
  );
};

export default LayoutWrapper;
