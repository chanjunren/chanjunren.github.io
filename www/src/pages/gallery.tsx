import { ReactElement } from "react";
import NavButton from "../components/common/NavButton";
import Page from "../components/common/Page";
import PrimaryHeader from "../components/common/PrimaryHeader";
import ProjectGallery from "../components/projects/ProjectGallery";

export default function Gallery(): ReactElement {
  return (
    <Page
      title={"gallery"}
      description="Hello! Welcome to my digital garden"
      className="flex-grow"
    >
      <NavButton
        className="md:col-span-2 self-start mb-5"
        label="home"
        path="/"
      />
      <PrimaryHeader className="justify-self-center mb-10">
        🪴 gallery
      </PrimaryHeader>
      <div className="grid md:grid-cols-12 gap-x-4 md:gap-y-3 gap-y-5 auto-rows-[240px] md:auto-rows-[190px]">
        <ProjectGallery />
      </div>
    </Page>
  );
}
