import { ReactElement } from "react";
import NavButton from "../components/common/NavButton";
import Page from "../components/common/Page";
import Education from "../components/home/Education";
import Hobbies from "../components/home/Hobbies";
import Work from "../components/home/Work";

export default function About(): ReactElement {
  return (
    <Page
      className="flex flex-col justify-center"
      title={"about"}
      description="Hello! Welcome to my digital garden"
    >
      <NavButton className="mb-10" label="home" path="/" />
      <div className="grid md:grid-cols-2 items-center self-center">
        <div>
          <Work />
          <Education />
        </div>
        <Hobbies />
      </div>
    </Page>
  );
}
