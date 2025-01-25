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
      <div className="flex-grow grid md:grid-cols-4 grid-cols-1 gap-7 max-w-7xl">
        <ProjectGallery />
      </div>
    </Page>
  );
}
