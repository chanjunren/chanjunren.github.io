import { ReactElement } from "react";
import ProjectGallery from "@site/src/components/projects/project-gallery";
import { SplitFlap } from "@site/src/components/ui/split-flap";

export default function Gallery(): ReactElement {
  return (
    <section className="col-span-12">
      <SplitFlap flipIn value="GALLERY" className="mb-5 text-lg" />
      <section className="col-span-12 grid md:grid-cols-12 gap-x-4 md:gap-y-3 gap-y-5 auto-rows-[240px] md:auto-rows-[190px]">
        <ProjectGallery />
      </section>
    </section>
  );
}
