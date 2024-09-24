import { ReactElement } from "react";
import LayoutWrapper from "../components/common/LayoutWrapper";
import Connect from "../components/home/Connect";
import Education from "../components/home/Education";
import Hobbies from "../components/home/Hobbies";
import WelcomeSection from "../components/home/Welcome";
import Work from "../components/home/Work";

export default function Home(): ReactElement {
  return (
    <LayoutWrapper
      title={"home"}
      description="Hello! Welcome to my digital garden"
    >
      <div className="flex w-full gap-10 flex-wrap">
        <WelcomeSection />
        <section>
          <Work />
          <Connect />
        </section>
        <section>
          <Hobbies />
          <Education />
        </section>
        {/* <ProjectCards /> */}
      </div>
    </LayoutWrapper>
  );
}
