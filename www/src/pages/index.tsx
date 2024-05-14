import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";

import BestFooter from "../components/home/BestFooter";
import BuildingInProgress from "../components/home/BuildingInProgress";

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <main className="flex flex-col h-[90vh] justify-items-center items-center">
        <BuildingInProgress />
        <BestFooter />
      </main>
    </Layout>
  );
}
