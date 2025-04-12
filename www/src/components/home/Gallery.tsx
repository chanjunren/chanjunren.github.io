import { ReactElement } from "react";
import PrimaryHeader from "../common/PrimaryHeader";
import ProjectGallery from "../projects/ProjectGallery";

export default function Gallery(): ReactElement {
  return (
    <>
      <PrimaryHeader className="!justify-self-center col-span-12 mb-5">
        🪴 gallery
      </PrimaryHeader>
      <section className="col-span-12 grid md:grid-cols-12 gap-x-4 md:gap-y-3 gap-y-5 auto-rows-[240px] md:auto-rows-[190px]">
        <ProjectGallery />
      </section>
    </>
  );
}
