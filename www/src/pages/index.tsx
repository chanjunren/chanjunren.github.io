import ProjectGallery from "@site/src/components/projects/ProjectGallery";
import { ReactElement } from "react";
import Page from "../components/common/Page";
import Education from "../components/home/Education";
import Hobbies from "../components/home/Hobbies";
import Socials from "../components/home/Socials";
import Welcome from "../components/home/Welcome";
import Work from "../components/home/Work";

export default function Home(): ReactElement {
  return (
    <Page title={"home"} description="Hello! Welcome to my digital garden">
      <div className="grid grid-cols-12 gap-10">
        <div className="md:col-span-8 col-span-12">
          <Welcome />
          <Hobbies />
        </div>
        <div className="lg:col-span-4 col-span-12">
          <Work />
          <Education />
          <Socials />
        </div>
        <ProjectGallery />
      </div>
    </Page>
  );
}
