import { FC } from "react";
import { GALLERY_PROJECTS } from "../../projects";
import { GalleryProject } from "../../types";
import DefaultCarouselCard from "../DefaultCarouselCard";

type CarouselProps = {
  selectedProject: GalleryProject | null;
};

const Carousel: FC<CarouselProps> = ({ selectedProject }) => {
  return (
    <div className="flex gap-5 h-[25%]">
      {GALLERY_PROJECTS.map((proj, idx) => (
        <DefaultCarouselCard
          key={`gallery-carousel-card-${idx}`}
          {...proj}
          selected={selectedProject && selectedProject.id === proj.id}
        />
      ))}
    </div>
  );
};

export default Carousel;
