import Layout from "@theme/Layout";
import { FC, PropsWithChildren } from "react";
import LitFooter from "./LitFooter";

type PageProps = {
  title: string;
  description?: string;
};
const Page: FC<PropsWithChildren<PageProps>> = ({
  title,
  description = "Hi there! I'm Jun Ren",
  children,
}) => {
  return (
    <Layout title={title} description={description}>
      <main className="flex flex-col justify-between min-h-screen-minus-navbar p-7 items-center">
        {children}
        <LitFooter />
      </main>
    </Layout>
  );
};

export default Page;
