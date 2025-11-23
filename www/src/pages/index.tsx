import { ReactElement } from "react";
import Page from "../components/common/Page";
import About from "../components/home/About";
import Gallery from "../components/home/Gallery";
import Hobbies from "../components/home/Hobbies";
import Work from "../components/home/Work";

export default function Home(): ReactElement {
  return (
    <Page
      title={"home"}
      description="Hello! Welcome to my digital garden"
      className="grow grid grid-cols-12 md:gap-10 gap-y-20 pt-7"
    >
      <About />
      <div className="md:col-span-4 col-span-12 flex flex-col">
        <Work />
      </div>
      <Hobbies />
      <Gallery />
    </Page>
  );
}
