import Layout from "@theme/Layout";

import BestFooter from "../components/home/BestFooter";
import BuildingInProgress from "../components/home/BuildingInProgress";

export default function Home(): JSX.Element {
  return (
    <Layout title={"home"} description="Hello! Welcome to my digital garden">
      <main className="flex flex-col h-screen-minus-navbar justify-items-center items-center p-10">
        <BuildingInProgress />
        <BestFooter />
      </main>
    </Layout>
  );
}
