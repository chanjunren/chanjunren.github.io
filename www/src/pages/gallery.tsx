import { ReactElement } from "react";
import BackButton from "../components/common/BackButton";
import Page from "../components/common/Page";
import ProjectGallery from "../components/projects/ProjectGallery";

export default function Gallery(): ReactElement {
  return (
    <Page title={"gallery"} description="Hello! Welcome to my digital garden">
      <BackButton className="md:col-span-2 self-start mb-5" />
      <div className="flex-grow grid grid-cols-12 items-start self-center gap-10">
        <ProjectGallery />
      </div>
    </Page>
  );
}
