import { ReactElement } from "react";
import Page from "../components/common/Page";
import About from "../components/home/About";
import Education from "../components/home/Education";
import Gallery from "../components/home/Gallery";
import Hobbies from "../components/home/Hobbies";
import Work from "../components/home/Work";

export default function Home(): ReactElement {
  return (
    <Page
      title={"home"}
      description="Hello! Welcome to my digital garden"
      className="flex-grow grid grid-cols-12 gap-7"
    >
      <div className="md:col-span-4 col-span-12 flex flex-col gap-10">
        <About />
      </div>
      <div className="md:col-span-4 col-span-12 flex flex-col">
        <Work />
        <Education />
      </div>
      <Hobbies />
      <Gallery />
    </Page>
  );
}
