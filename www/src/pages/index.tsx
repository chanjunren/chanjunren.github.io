import ProjectGallery from "@site/src/components/projects/ProjectGallery";
import { ReactElement } from "react";
import LayoutWrapper from "../components/common/LayoutWrapper";
import Education from "../components/home/Education";
import Hobbies from "../components/home/Hobbies";
import Socials from "../components/home/Socials";
import WelcomeSection from "../components/home/Welcome";
import Work from "../components/home/Work";

export default function Home(): ReactElement {
  return (
    <LayoutWrapper
      title={"home"}
      description="Hello! Welcome to my digital garden"
    >
      <div className="grid grid-cols-12 gap-10">
        <section className="md:col-span-8 col-span-12">
          <WelcomeSection />
          <Hobbies />
        </section>
        <section className="lg:col-span-4 col-span-12">
          <Work />
          <Education />
          <Socials />
        </section>
        <ProjectGallery />
      </div>
    </LayoutWrapper>
  );
}
