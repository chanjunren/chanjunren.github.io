import { ReactElement } from "react";
import Page from "../components/common/Page";
import RedirectButton from "../components/common/RedirectButton";
import ProjectGallery from "../components/projects/ProjectGallery";

export default function Gallery(): ReactElement {
  return (
    <Page title={"gallery"} description="Hello! Welcome to my digital garden">
      <RedirectButton
        className="md:col-span-2 self-start mb-5"
        label="home"
        path="/"
      />
      <div className="flex-grow grid lg:grid-cols-12 grid-cols-1 gap-x-4 lg:gap-y-1 gap-y-5 max-w-7xl auto-rows-fr">
        <ProjectGallery />
      </div>
    </Page>
  );
}
