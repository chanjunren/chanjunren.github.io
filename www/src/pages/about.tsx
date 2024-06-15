import { FC } from "react";
import Connect from "../components/about/Connect";
import Education from "../components/about/Education";
import Hobbies from "../components/about/Hobbies";
import Work from "../components/about/Work";
import LayoutWrapper from "../components/common/LayoutWrapper";

const AboutMe: FC = () => {
  return (
    <LayoutWrapper title="home">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-5 justify-center">
        <div className="flex flex-col gap-5">
          <Work />
          <Education />
          <Connect />
        </div>
        <Hobbies />
      </div>
    </LayoutWrapper>
  );
};

export default AboutMe;
