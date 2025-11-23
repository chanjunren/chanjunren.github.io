import { ReactElement } from "react";
import ProjectGallery from "@site/src/components/projects/project-gallery";
import CustomTag from "@site/src/components/ui/custom-tag";

export default function Gallery(): ReactElement {
  return (
    <section className="col-span-12">
      <CustomTag
        className="text-lg tracking-tighter! justify-self-center! mb-5"
        color="rose"
      >
        GALLERY
      </CustomTag>
      <section className="col-span-12 grid md:grid-cols-12 gap-x-4 md:gap-y-3 gap-y-5 auto-rows-[240px] md:auto-rows-[190px]">
        <ProjectGallery />
      </section>
    </section>
  );
}
