import { ReactElement } from "react";
import LayoutWrapper from "../components/common/LayoutWrapper";
import Connect from "../components/home/Connect";
import Education from "../components/home/Education";
import Hobbies from "../components/home/Hobbies";
import ProjectCards from "../components/home/projects/ProjectCards";
import WelcomeSection from "../components/home/Welcome";
import Work from "../components/home/Work";

export default function Home(): ReactElement {
  return (
    <LayoutWrapper
      title={"home"}
      description="Hello! Welcome to my digital garden"
    >
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-10 gap-y-5 items-start justify-items-start">
        <WelcomeSection />
        <section>
          <Work />
          <Education />
        </section>
        <section>
          <Hobbies />
          <Connect />
        </section>
        <ProjectCards />
      </div>
    </LayoutWrapper>
  );
}
