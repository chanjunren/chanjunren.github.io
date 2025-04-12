import { ReactElement } from "react";
import Page from "../components/common/Page";
import About from "../components/home/About";
import Education from "../components/home/Education";
import Gallery from "../components/home/Gallery";
import Hobbies from "../components/home/Hobbies";
import Socials from "../components/home/Socials";
import Work from "../components/home/Work";

export default function Home(): ReactElement {
  return (
    <Page
      title={"home"}
      description="Hello! Welcome to my digital garden"
      className="flex-grow grid grid-cols-12 gap-7"
    >
      <div className="col-span-5 flex flex-col gap-10">
        <About />
        <Hobbies />
      </div>
      <div className="col-span-5 flex flex-col">
        <Work />
        <Education />
      </div>
      <Socials />
      <Gallery />
    </Page>
  );
}
