import { ReactElement } from "react";
import Page from "../components/common/Page";
import RedirectButton from "../components/common/RedirectButton";
import ProjectGallery from "../components/projects/ProjectGallery";

export default function Gallery(): ReactElement {
  return (
    <Page title={"gallery"} description="Hello! Welcome to my digital garden">
      <RedirectButton
        className="md:col-span-2 self-start"
        label="home"
        path="/"
      />
      <div className="flex-grow grid lg:grid-cols-12 gap-x-4 md:gap-y-3 gap-y-5 lg:max-w-5xl auto-rows-[240px] lg:auto-rows-[190px]">
        <ProjectGallery />
      </div>
    </Page>
  );
}
