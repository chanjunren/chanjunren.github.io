import { FC } from "react";
import { GALLERY_PROJECTS } from "../../projects";
import { GalleryProject } from "../../types";
import DefaultCarouselCard from "../DefaultCarouselCard";

type CarouselProps = {
  selectedProject: GalleryProject | null;
  onCardSelected: (GalleryProject) => void;
};

const Carousel: FC<CarouselProps> = ({ selectedProject, onCardSelected }) => {
  return (
    <div className="flex gap-5 h-[20%] px-8 max-[996px]:hidden items-center">
      {GALLERY_PROJECTS.map((proj, idx) => (
        <DefaultCarouselCard
          key={`gallery-carousel-card-${idx}`}
          project={proj}
          onCardSelected={onCardSelected}
          selected={selectedProject && selectedProject.id === proj.id}
        />
      ))}
    </div>
  );
};

export default Carousel;
