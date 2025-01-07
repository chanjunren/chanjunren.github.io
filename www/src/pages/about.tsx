import { ReactElement } from "react";
import BackButton from "../components/common/BackButton";
import Page from "../components/common/Page";
import Education from "../components/home/Education";
import Hobbies from "../components/home/Hobbies";
import Work from "../components/home/Work";

export default function About(): ReactElement {
  return (
    <Page title={"about"} description="Hello! Welcome to my digital garden">
      <BackButton className="self-start mb-5" />
      <div className="grid md:grid-cols-2 items-center flex-grow gap-10 pb-10">
        <div>
          <Work />
          <Education />
        </div>
        <Hobbies />
      </div>
    </Page>
  );
}
