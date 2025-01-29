import { ReactElement } from "react";
import Page from "../components/common/Page";
import RedirectButton from "../components/common/RedirectButton";
import Education from "../components/home/Education";
import Hobbies from "../components/home/Hobbies";
import Work from "../components/home/Work";

export default function About(): ReactElement {
  return (
    <Page
      className="flex flex-col"
      title={"about"}
      description="Hello! Welcome to my digital garden"
    >
      <RedirectButton className="mb-10" label="home" path="/" />
      <div className="grid md:grid-cols-2 flex-grow items-center self-center">
        <div>
          <Work />
          <Education />
        </div>
        <Hobbies />
      </div>
    </Page>
  );
}
